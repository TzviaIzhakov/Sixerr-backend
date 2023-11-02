import { logger } from '../services/logger.service.js'

export async function log(req, res, next) {
    logger.info('Req was made', req.route.path)
    next()
}