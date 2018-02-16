import dotenv from 'dotenv'

dotenv.config()

// GraphQL Configurations
export const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || '/graphql'
export const GRAPHIQL_ENDPOINT = process.env.GRAPHIQL_ENDPOINT || '/graphiql'
export const SUBSCRIPTION_ENDPOINT = process.env.SUBSCRIPTION_ENDPOINT || '/subscriptions'