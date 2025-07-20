import { initDB } from "./utils/db"
import { initLogger, log } from "./utils/log"
import dotenv from "dotenv"

async function main() {
  dotenv.config()
  initLogger(process.env.LOG_LEVEL)
  log.info("Starting server")
  const db = initDB()
  log.info("DB initialized")
}

main()
