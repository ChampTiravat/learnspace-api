import dotenv from 'dotenv'

dotenv.config()

// Application Configuration
export const APP_PORT = 5000 || process.env.APP_PORT
export const APP_HOST = `0.0.0.0` || process.env.APP_HOST
export const APP_SERVING_PATH = `${APP_HOST}:${APP_PORT}`
export const WEB_CLIENT_HOST = process.env.WEB_CLIENT_HOST
