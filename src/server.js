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
import mongooseRedisCache from 'mongoose-redis-cache'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas'

// ------------------------------------------------------------------
// Configurations
// ------------------------------------------------------------------
import {
  DB_CONNECTION_STRING,
  REDIS_HOST,
  REDIS_PORT,
  SUBSCRIPTION_ENDPOINT,
  GRAPHIQL_ENDPOINT,
  GRAPHQL_ENDPOINT,
  APP_SERVING_PATH,
  WEB_CLIENT_HOST,
  APP_PORT,
  APP_HOST
} from './config'

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
import extractUserFromToken from './middlewares/extractUserFromToken'
import models from './models'

// ------------------------------------------------------------------
// Initialize App
// ------------------------------------------------------------------
const app = express()
const server = http.createServer(app)

// ------------------------------------------------------------------
// Connecting to MongoDBHOST
// ------------------------------------------------------------------
mongoose.Promise = bluebird
mongoose.connect(DB_CONNECTION_STRING, {
  useMongoClient: true
})

// ------------------------------------------------------------------
// Enable Redis Cache for Mongoose queries
// ------------------------------------------------------------------
mongooseRedisCache(mongoose, {
  host: REDIS_HOST,
  port: REDIS_PORT
})

// ------------------------------------------------------------------
// Connection to Redis
// ------------------------------------------------------------------
const redisClient = redis.createClient({
  host: REDIS_HOST
})

// ------------------------------------------------------------------
// Using bluebird as a Promise in Redis client
// ------------------------------------------------------------------
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

// ------------------------------------------------------------------
// Do not send the server's details to the client
// ------------------------------------------------------------------
app.disable('X-Powered-By')

// ------------------------------------------------------------------
// Middlewares
// ------------------------------------------------------------------
app.use(cors(WEB_CLIENT_HOST))
app.use(extractUserFromToken)

// ------------------------------------------------------------------
// Setup GraphQL Schema
// ------------------------------------------------------------------
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, 'resolvers')))
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, 'schemas')))
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

// ------------------------------------------------------------------
// GraphQL Entry Point
// ------------------------------------------------------------------
app.use(
  GRAPHQL_ENDPOINT,
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    debug: !!process.env.NODE_ENV === 'development',
    context: {
      user: req.user,
      redisClient,
      models
    }
  }))
)

// ------------------------------------------------------------------
// GraphiQL Entry Point
// ------------------------------------------------------------------
app.use(
  GRAPHIQL_ENDPOINT,
  bodyParser.json(),
  graphiqlExpress({
    endpointURL: GRAPHQL_ENDPOINT
  })
)

// ------------------------------------------------------------------
// Initiate the server
// ------------------------------------------------------------------
server.listen(APP_PORT, APP_HOST, err => {
  if (err) throw err
  console.log(`
=============================================================
           |
    Server |    ${APP_SERVING_PATH}
           |
-----------|-------------------------------------------------
           |
  Database |    ${DB_CONNECTION_STRING}
           |
=============================================================
`)

  const subscriptionMetaData = {
    execute,
    subscribe,
    schema
  }

  const subscriptionConfig = {
    server,
    path: SUBSCRIPTION_ENDPOINT
  }

  new SubscriptionServer(subscriptionMetaData, subscriptionConfig)
})
