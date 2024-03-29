import Joi from 'joi'

export default Joi.object({
    APP_NAME: Joi.string().required(),
    APP_ENV: Joi.string()
        .valid('local', 'staging', 'production')
        .default('local'),
    APP_PORT_HTTP: Joi.number().required(),
    APP_LOG: Joi.string().valid('info', 'error', 'warn').required(),
    TELEGRAM_BOT_ACCESS_TOKEN: Joi.string().required(),
    GATHER_SPACE_ID: Joi.string().required(),
    GATHER_API_KEY: Joi.string().required(),
})
