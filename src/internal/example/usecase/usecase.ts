import winston from 'winston'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { Request } from 'express'

import { Config } from '../../../config/config.interface'

class Usecase {
    constructor(
        private config: Config,
        private logger: winston.Logger,
        private bot: Telegraf<Context<Update>>
    ) {}

    private chatId!: number

    public launch() {
        // Load all commands
        this.start()

        this.bot.launch()
        this.logger.info(`🚀 Bot launched`)
    }

    private start() {
        this.bot.command('start', async (ctx) => {
            this.chatId = ctx.chat.id
            this.logger.info(ctx.from)

            await this.bot.telegram.sendMessage(
                this.chatId,
                `👋 Hello ${ctx.from.first_name}, Nice to meet you! 👋`
            )
        })
    }

    public async Webhook(req: Request['body']) {
        this.logger.info(req)

        let action: string = ''
        let emoji: string = ''

        if (req.type === 'feature-environment-enabled') {
            action = 'Enabled'
            emoji = '✅'
        } else if (req.type === 'feature-environment-disabled') {
            action = 'Disabled'
            emoji = '❌'
        }

        console.log('emoji', emoji)

        if (!action) return

        const text =
            `*Feature*: ${req.featureName}\n` +
            `*Environment*: ${req.environment}\n` +
            `*Action*: ${action} ${emoji}\n`

        await this.bot.telegram.sendMessage(this.chatId, text, {
            parse_mode: 'Markdown',
        })
    }
}

export default Usecase
