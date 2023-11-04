import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import { login, signup, logout } from './auth.controller.js'

export const authRoutes = express.Router()

authRoutes.post('/login', log, login)
authRoutes.post('/signup', log, signup)
authRoutes.post('/logout', log, logout)