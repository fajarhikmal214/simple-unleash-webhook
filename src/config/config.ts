import dotenv from 'dotenv'
import { Config } from './config.interface'
import configValidate from './config.validate'

dotenv.config()

const env = configValidate(process.env)

const config: Config = {
    app: {
        name: env.APP_NAME,
        env: env.APP_ENV,
        port: {
            http: env.APP_PORT_HTTP,
        },
        log: env.APP_LOG,
    },
    bot: {
        access_token: env.TELEGRAM_BOT_ACCESS_TOKEN,
    },
}

export default config
