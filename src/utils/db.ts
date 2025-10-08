import { log } from "#root/ioc.js"
import fs from "node:fs"
import path from "node:path"
import { Kysely } from "kysely"
import { SqliteDialect } from "kysely-node-sqlite"
import { DatabaseSync } from "node:sqlite"
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
