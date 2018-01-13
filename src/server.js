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

import initializeUserToContext from './middlewares/initializeUserToContext'
import { APP_SERVING_PATH, APP_PORT } from './config/application-config'
import { DB_CONNECTION_STRING } from './config/database-config'

// Initialize App
const app = express()

// Connecting to MongoDB
mongoose.Promise = bluebird
mongoose.connect(DB_CONNECTION_STRING, {
  useMongoClient: true
})

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
  initializeUserToContext,
  graphqlExpress(req => ({
    schema,
    debug: process.env.NODE_ENV === 'development' ? true : false,
    context: { user: req.user }
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
  console.log(`Server started at ${APP_SERVING_PATH}`)
})
