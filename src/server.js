import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { makeExecutableSchema } from 'graphql-tools'
import { subscribe, execute } from 'graphql'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import bluebird from 'bluebird'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import path from 'path'

import { APP_SERVING_PATH, APP_PORT } from './config/application-config'
import { DB_CONNECTION_STRING } from './config/database-config'

import extractUserFromToken from './middlewares/extractUserFromToken'

// Initialize App
const app = express()
const server = http.createServer(app)

// Connecting to MongoDB
mongoose.Promise = bluebird
mongoose.connect(DB_CONNECTION_STRING, {
  useMongoClient: true
})

// Middlewares
app.use(cors('*'))
app.use(extractUserFromToken)

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

const subscriptionMetaData = {
  execute,
  subscribe,
  schema
}

const subscriptionConfig = {
  server,
  path: '/subscriptions'
}

// Startint the server
server.listen(APP_PORT, err => {
  if (err) throw err
  console.log(`Server started at ${APP_SERVING_PATH}`)
  new SubscriptionServer(subscriptionMetaData, subscriptionConfig)
})
