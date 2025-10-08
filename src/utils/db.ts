import { Kysely } from "kysely"
import { SqliteDialect } from "kysely-node-sqlite"
import fs from "node:fs"
import path from "node:path"
import { DatabaseSync } from "node:sqlite"
import { fileURLToPath } from "node:url"
import { migrateDB } from "./migrate.js"

export function initDB(dbLocation: string) {
  const isExist = fs.existsSync(dbLocation)
  if (!isExist) {
    fs.mkdirSync(path.dirname(dbLocation), { recursive: true })
  }

  const db = new Kysely<DB.Schema>({
    dialect: new SqliteDialect({
      database: new DatabaseSync(dbLocation),
    }),
  })

  // Get the current file's directory path in ES modules
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const migrationsLocation = path.join(
    __dirname,
    "..",
    "..",
    "db",
    "migrations",
  )
  migrateDB(db, migrationsLocation)
  return db
}
