import dotenv from 'dotenv'

dotenv.config()

// ------------------------------------------------------------------
// Determine wether running the project in testing environment or not
// ------------------------------------------------------------------
export const isTesting = !!process.env.TESTING

// ------------------------------------------------------------------
// Application Configuration
// ------------------------------------------------------------------
export const APP_PORT = process.env.APP_PORT || 5000
export const APP_HOST = process.env.APP_HOST || `0.0.0.0`
export const APP_SERVING_PATH = `${APP_HOST}:${APP_PORT}`
export const WEB_CLIENT_HOST = process.env.WEB_CLIENT_HOST

// ------------------------------------------------------------------
// MongoDB Database Configurations
// ------------------------------------------------------------------
export const MONGODB_HOST = isTesting ? process.env.MONGODB_TEST_HOST : process.env.MONGODB_HOST
export const MONGODB_PORT = isTesting ? process.env.MONGODB_TEST_PORT : process.env.MONGODB_PORT
export const MONGODB_DBNAME = isTesting ? process.env.MONGODB_TEST_DBNAME: process.env.MONGODB_DBNAME
export const DB_CONNECTION_STRING = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DBNAME}`

// ------------------------------------------------------------------
// Redis Database Configurations
// ------------------------------------------------------------------
export const REDIS_HOST = isTesting ? process.env.REDIS_TEST_HOST : process.env.REDIS_HOST
export const REDIS_PORT = isTesting ? process.env.REDIS_TEST_PORT : process.env.REDIS_PORT

// ------------------------------------------------------------------
// GraphQL Configurations
// ------------------------------------------------------------------
export const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || '/graphql'
export const GRAPHIQL_ENDPOINT = process.env.GRAPHIQL_ENDPOINT || '/graphiql'
export const SUBSCRIPTION_ENDPOINT = process.env.SUBSCRIPTION_ENDPOINT || '/subscriptions'

// ------------------------------------------------------------------
// Security Configuration
// ------------------------------------------------------------------
export const SECRET_TOKEN_KEY = process.env.SECRET_TOKEN_KEY;
