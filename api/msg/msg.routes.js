import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getMsgs, getMsgById, addMsg, updateMsg, removeMsg } from './msg.controller.js'

export const messageRoutes = express.Router()

msgRoutes.get('/', log, getMsgs)
msgRoutes.get('/:id', getMsgById)
msgRoutes.post('/', addMsg)
msgRoutes.put('/:id', updateMsg)
msgRoutes.delete('/:id', removeMsg)
