import dotenv from 'dotenv'

dotenv.config()

// Application Configuration
export const APP_PORT = 5000 || process.env.APP_PORT
export const APP_HOST = `http://localhost`
export const APP_SERVING_PATH = `${APP_HOST}:${APP_PORT}`
