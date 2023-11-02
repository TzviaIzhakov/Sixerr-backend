import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getGigs, getGigById, addGig, updateGig, removeGig} from './gig.controller.js'

export const gigRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

gigRoutes.get('/', log, getGigs)
gigRoutes.get('/:id', getGigById)
gigRoutes.post('/',requireAuth,requireAdmin, addGig)
gigRoutes.put('/', updateGig)
gigRoutes.delete('/:id',requireAuth,requireAdmin, removeGig)
// gigRoutes.post('/:id/msg', requireAuth,addGigMsg)


// router.delete('/:id', requireAuth, requireAdmin, removeCar)
// gigRoutes.delete('/:id/msg/:msgId', removeCarMsg)