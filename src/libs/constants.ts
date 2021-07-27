export const GRAPHQL_URL = process.env.GRAPHQL_URL || 'http://localhost:4000'
export const SHADOW_ROW_COUNT = process.env.GRAPHQL_URL ? parseInt(process.env.GRAPHQL_URL) : 8