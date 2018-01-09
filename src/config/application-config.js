import dotenv from "dotenv";

dotenv.config();

// Application Configuration
export const APP_PORT = 5000 || process.env.APP_PORT;
