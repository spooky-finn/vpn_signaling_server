import dotenv from "dotenv"
import { validateDeployEnv } from "./src/env.js"
import { Remote, RemoteConn } from "./src/utils/remote_conn.js"
;(async () => {
  dotenv.config({ quiet: true })
  // Validate environment variables using typia
  const env = validateDeployEnv()
  const config: Remote = {
    host: env.DeployHost,
    sshKeyPath: env.DeployKeyfile,
    user: env.DeployUser,
  }
  const result = await new RemoteConn(config).run(
    env.DeployCommand,
    env.DeployCwd,
  )
  console.log(result)
})()
