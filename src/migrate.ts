import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

async function main() {
  const connectionString = 'postgresql://docker:docker@localhost:5432/pizzashop'
  const sql = postgres(connectionString, { max: 1 })
  const db = drizzle(sql)

  await migrate(db, { migrationsFolder: 'drizzle' })

  await sql.end()
}

main()
