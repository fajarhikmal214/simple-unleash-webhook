import express, { Express, NextFunction, Request, Response } from 'express'
import winston from 'winston'
import statusCode from '../../pkg/statusCode'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import compression from 'compression'
import { Config } from '../../config/config.interface'
import Error from '../../pkg/error'

class Http {
    public app: Express

    constructor(private logger: winston.Logger, private config: Config) {
        this.app = express()
        this.plugins()
        this.pageHome()
    }

    private plugins() {
        this.app.use(cors())
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json())
        this.app.use(helmet())
        this.app.use(compression())
        this.app.use(express.json())
    }

    private pageNotFound = () => {
        this.app.get('*', (_: Request, res: Response) => {
            throw new Error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )
        })
    }

    private onError = (
        error: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const status = error.status || 500
        const message = error.message || 'Something went wrong'

        return res.status(status).json({
            status,
            message,
        })
    }

    public AdditionalInfo(req: any, statusCode: number) {
        return {
            env: this.config.app.env,
            http_uri: req.originalUrl,
            http_host: req.protocol + '://' + req.headers.host,
            http_method: req.method,
            http_scheme: req.protocol,
            remote_addr: req.httpVersion,
            user_agent: req.headers['user-agent'],
            tz: new Date(),
            code: statusCode,
            user: req.user || {},
        }
    }

    public Router() {
        return express.Router()
    }

    public SetRouter(prefix: string, ...router: any) {
        this.app.use(prefix, router)
    }

    private pageHome = () => {
        this.app.get('/', (_: Request, res: Response) => {
            res.status(statusCode.OK).json({
                app_name: this.config.app.name,
            })
        })
    }

    public Run(port: number) {
        this.pageNotFound()
        this.app.use(this.onError)
        this.app.listen(port, () => {
            this.logger.info(`Server http is running at http://0.0.0.0:${port}`)
        })
    }
}

export default Http
