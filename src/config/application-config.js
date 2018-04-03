import dotenv from 'dotenv'

dotenv.config()

// Application Configuration
export const APP_PORT = process.env.APP_PORT || 5000
export const APP_HOST = process.env.APP_HOST || `0.0.0.0`
export const APP_SERVING_PATH = `${APP_HOST}:${APP_PORT}`
export const WEB_CLIENT_HOST = process.env.WEB_CLIENT_HOST
