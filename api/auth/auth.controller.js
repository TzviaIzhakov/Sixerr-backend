import { authService } from './auth.service.js'
import { logger } from '../../services/logger.service.js'

export async function login(req, res) {
    const { username, password } = req.body
    // console.log( username, password);
    try {
        const user = await authService.login(username, password)
        const loginToken = authService.getLoginToken(user)

        logger.info('User login: ', username)
        res.cookie('loginToken', loginToken)

        res.json(user)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

export async function signup(req, res) {
    try {
        const { username, password, fullname, imgUrl, rate } = req.body
        const account = await authService.signup(username, password, fullname, imgUrl, rate)
        logger.debug(`auth.route - new account created: ` + username + ' ' + fullname)
        const user = await authService.login(username, password)
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.json(user)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}