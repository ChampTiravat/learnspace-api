import dotenv from 'dotenv'

dotenv.config()

// MongoDB Database Configurations
export const MONGODB_DEV_HOST = process.env.MONGODB_DEV_HOST
export const MONGODB_DEV_DBNAME = process.env.MONGODB_DEV_DBNAME
export const MONGODB_DEV_PORT = process.env.MONGODB_DEV_PORT
export const DB_CONNECTION_STRING =`mongodb://${MONGODB_DEV_HOST}${MONGODB_DEV_PORT}/${MONGODB_DEV_DBNAME}`

// Redis Database Configurations
export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_PORT = process.env.REDIS_PORT
