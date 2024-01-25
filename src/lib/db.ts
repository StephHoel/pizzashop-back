import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const client = new Pool({
  connectionString: 'postgresql://docker:docker@localhost:5432/pizzashop',
})

export const db = drizzle(client)
