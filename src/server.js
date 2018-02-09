import cors from 'cors'
import http from 'http'
import path from 'path'
import redis from 'redis'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import bluebird from 'bluebird'
import bodyParser from 'body-parser'
import { subscribe, execute } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas'

// Configurations
import { DB_CONNECTION_STRING, REDIS_HOST } from './config/database-config'
import {
  APP_SERVING_PATH,
  WEB_CLIENT_HOST,
  APP_PORT,
  APP_HOST
} from './config/application-config'

// Helpers
import extractUserFromToken from './middlewares/extractUserFromToken'
import models from './models'

// Initialize App
const app = express()
const server = http.createServer(app)

// Connecting to MongoDBHOST
mongoose.Promise = bluebird
mongoose.connect(DB_CONNECTION_STRING, {
  useMongoClient: true
})

// Connection to Redis
const redisClient = redis.createClient({
  host: REDIS_HOST
})

// Using bluebird as a Promise in Redis client
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

// Do not send the server's details to the client
app.disable('X-Powered-By')

// Middlewares
app.use(cors(WEB_CLIENT_HOST))
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
    context: {
      user: req.user,
      redisClient,
      models
    }
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

// Startint the server
server.listen(APP_PORT, APP_HOST, err => {
  if (err) throw err
  console.log(`Server started at ${APP_SERVING_PATH}`)

  const subscriptionMetaData = {
    execute,
    subscribe,
    schema
  }

  const subscriptionConfig = {
    server,
    path: '/subscriptions'
  }

  new SubscriptionServer(subscriptionMetaData, subscriptionConfig)
})
