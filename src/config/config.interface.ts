export interface Config {
    app: {
        name: string
        env: string
        port: {
            http: number
        }
        log: string
    }
    bot: {
        access_token: string
    }
    gather: {
        api_key: string
        space_id: string
    }
}
