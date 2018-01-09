import dotenv from "dotenv";

dotenv.config();

// Database Configuration
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_NAME =
  process.env.TESTING === true
    ? process.env.DB_TEST_NAME
    : process.env.DB_DEV_NAME;
