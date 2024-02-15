import winston from 'winston'
import { Context, Telegraf } from 'telegraf'
import Usecase from './usecase/usecase'
import Http from '../../transport/http/http'
import { Update } from 'telegraf/typings/core/types/typegram'
import Handler from './delivery/http/handler'
import { Config } from '../../config/config.interface'

class Example {
    constructor(
        private logger: winston.Logger,
        private config: Config,
        private bot: Telegraf<Context<Update>>,
        private http: Http
    ) {
        const usecase = new Usecase(this.config, this.logger, this.bot)

        usecase.launch()
        this.loadHttp(usecase)
    }

    private loadHttp(usecase: Usecase) {
        const handler = new Handler(usecase, this.logger)

        this.http.app.post('/v1/webhook', handler.Webhook())
    }
}

export default Example
