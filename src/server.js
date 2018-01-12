import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import bluebird from 'bluebird'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import path from 'path'

import { DB_HOST, DB_PORT, DB_NAME } from './config/database-config'
import { APP_PORT } from './config/application-config'

const DB_DEV_CONNECTION_STRING = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

// Initialize App
const app = express()

// Connecting to MongoDB
mongoose.connect(DB_DEV_CONNECTION_STRING, {
	useMongoClient: true
})
mongoose.Promise = bluebird
console.log(DB_DEV_CONNECTION_STRING)

// Middlewares
app.use(cors('*'))

// Setup Schema
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, 'resolvers')))
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, 'schemas')))

const schema = makeExecutableSchema({
	typeDefs,
	resolvers
})

// GraphQL Entry Point
app.use(
	'/graphql',
	bodyParser.json(),
	graphqlExpress(req => ({
		schema,
		debug: process.env.NODE_ENV === 'development' ? true : false,
		context: { test: 'hello from context' }
	}))
)

// GraphiQL Entry Point
app.use(
	'/graphiql',
	bodyParser.json(),
	graphiqlExpress({
		endpointURL: '/graphql'
	})
)

http.createServer(app).listen(APP_PORT, err => {
	console.log(`Server started at http://localhost:${APP_PORT}`)
})
