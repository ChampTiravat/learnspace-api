import dotenv from 'dotenv'

dotenv.config()

const isTesting = !!process.env.TESTING

// MongoDB Database Configurations
export const MONGODB_HOST 	  = isTesting ? process.env.MONGODB_TEST_HOST : process.env.MONGODB_HOST
export const MONGODB_PORT     	  = isTesting ? process.env.MONGODB_TEST_PORT : process.env.MONGODB_PORT
export const MONGODB_DBNAME       = isTesting ? process.env.MONGODB_TEST_DBNAME: process.env.MONGODB_DBNAME
export const DB_CONNECTION_STRING = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DBNAME}`

// Redis Database Configurations
export const REDIS_HOST = isTesting ? process.env.REDIS_TEST_HOST : process.env.REDIS_HOST
export const REDIS_PORT = isTesting ? process.env.REDIS_TEST_PORT : process.env.REDIS_PORT
