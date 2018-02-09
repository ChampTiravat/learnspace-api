import dotenv from 'dotenv'

dotenv.config()

// Database Configuration
export const DB_HOST = process.env.DB_HOST
export const DB_PORT = process.env.DB_PORT
export const DB_NAME =
  process.env.NODE_ENV == 'test'
    ? process.env.DB_TEST_NAME
    : process.env.DB_DEV_NAME

export const DB_CONNECTION_STRING = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_PORT = process.env.REDIS_PORT
