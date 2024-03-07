import winston from 'winston'
import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { Request } from 'express'
import Axios from 'axios'

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
        this.generate_gather()

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

    private generate_gather() {
        this.bot.command('new_gather', async (ctx) => {
            this.logger.info(ctx.from)

            await this.func_generate_gather(ctx)
        })
    }

    private async func_generate_gather(ctx: any) {
        try {
            const response = await Axios.post(
                'https://api.gather.town/api/v2/spaces',
                {
                    sourceSpace: 'cWbyYm8puuBXarE3\\SIDEBARU',
                    name: 'SIDEBARU',
                },
                {
                    headers: {
                        apiKey: this.config.gather.api_key,
                    },
                }
            )

            await this.bot.telegram.sendMessage(
                ctx.chat.id,
                `https://app.gather.town/app/${response.data}`
            )
        } catch (err: any) {
            await this.bot.telegram.sendMessage(
                ctx.chat.id,
                `Error : ${err.message}.`
            )
        }
    }
}

export default Usecase
