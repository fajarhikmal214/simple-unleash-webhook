import { NextFunction, Request, Response } from 'express'
import winston from 'winston'
import Usecase from '../../usecase/usecase'
import statusCode from '../../../../pkg/statusCode'

class Handler {
    constructor(private usecase: Usecase, private logger: winston.Logger) {}

    public Webhook() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.usecase.Webhook(req.body)

                return res.status(statusCode.OK).json({ status: statusCode.OK })
            } catch (error: any) {
                return res.status(statusCode.BAD_REQUEST).json({ data: error })
            }
        }
    }
}

export default Handler
