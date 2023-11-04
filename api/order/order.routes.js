import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getOrders, getOrderById, addOrder, updateOrder, removeOrder, addOrderMsg } from './order.controller.js'

export const orderRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

orderRoutes.get('/', log, getOrders)
orderRoutes.get('/:id', getOrderById)
orderRoutes.post('/', requireAuth, addOrder)
orderRoutes.put('/', updateOrder)

// orderRoutes.delete('/:id', removeOrder)
// router.delete('/:id', requireAuth, requireAdmin, removeCar)
// orderRoutes.post('/:id/msg', requireAuth,addOrderMsg)
// orderRoutes.delete('/:id/msg/:msgId', removeCarMsg)