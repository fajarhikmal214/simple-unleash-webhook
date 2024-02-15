import config from './config/config'
import Logger from './pkg/logger'
import Example from './internal/example/example'
import Bot from './external/telegram-bot'
import Http from './transport/http/http'

const main = async () => {
    const { logger } = new Logger(config)
    const bot = await Bot.connect(logger, config)
    const http = new Http(logger, config)

    // Load internal apps
    new Example(logger, config, bot, http)

    if (config.app.env !== 'test') {
        http.Run(config.app.port.http)
    }

    return {
        http,
    }
}

export default main()
