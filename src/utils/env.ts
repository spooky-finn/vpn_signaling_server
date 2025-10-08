import typia from "typia"

export interface AppEnv {
  // Telegram bot token (required)
  TgBotToken: string
  // Telegram admin user ID (required)
  TgAdminId: string
  // Client configuration endpoint URL (required)
  ClientConfigEndpoint: string
  // Database file location (required)
  DbLocation: string
  // Log level (optional, defaults to "info")
  LogLevel?: string
  // Whether to disable timestamp in logs (optional)
  LogDisableTimestamp?: string
}
// Deployment environment variables
export interface DeployEnv {
  // Deployment host (required)
  DeployHost: string
  // SSH key file path (required)
  DeployKeyfile: string
  // SSH user (required)
  DeployUser: string
  // Command to execute on remote host (required)
  DeployCommand: string
  // Working directory on remote host (required)
  DeployCwd: string
}
// Validates and returns application environment variables
export function validateAppEnv(): AppEnv {
  const env = {
    TgBotToken: process.env.TG_BOT_TOKEN,
    TgAdminId: process.env.TG_ADMIN_ID,
    ClientConfigEndpoint: process.env.CLIENT_CONFIG_ENDPOINT,
    DbLocation: process.env.DB_LOCATION,
    LogLevel: process.env.LOG_LEVEL,
    LogDisableTimestamp: process.env.LOG_DISABLE_TIMESTAMP,
  }
  const result = typia.validate<AppEnv>(env)
  if (!result.success) {
    console.error("Environment validation failed:")
    result.errors.forEach((error) => {
      console.error(`- ${error.path}: ${error.expected} (got: ${error.value})`)
    })
    process.exit(1)
  }
  return result.data
}
/**
 * Validates and returns deployment environment variables
 */
export function validateDeployEnv(): DeployEnv {
  const env = {
    DeployHost: process.env.DEPLOY_HOST,
    DeployKeyfile: process.env.DEPLOY_KEYFILE,
    DeployUser: process.env.DEPLOY_USER,
    DeployCommand: process.env.DEPLOY_COMMAND,
    DeployCwd: process.env.DEPLOY_CWD,
  }
  const result = typia.validate<DeployEnv>(env)
  if (!result.success) {
    console.error("Deployment environment validation failed:")
    result.errors.forEach((error) => {
      console.error(`- ${error.path}: ${error.expected} (got: ${error.value})`)
    })
    process.exit(1)
  }
  return result.data
}
