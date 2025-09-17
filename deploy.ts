import dotenv from "dotenv"
import { Remote, RemoteConn } from "./src/utils/remote_conn"
;(() => {
  dotenv.config()

  const config: Remote = {
    host: process.env.DEPLOY_HOST!,
    sshKeyPath: process.env.DEPLOY_KEYFILE!,
    user: process.env.DEPLOY_USER!,
  }

  new RemoteConn(config).run(
    "git pull && pm2 restart vpn_signaling_server",
    process.env.CWD!,
  )
})()
