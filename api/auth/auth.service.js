import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { userService } from '../user/user.service.js'
import { logger } from '../../services/logger.service.js'

export const authService = {
    signup,
    login,
    getLoginToken,
    validateToken
}

const cryptr = new Cryptr(process.env.SECRET || 'Secret-Puk-1234')

// console.log("bcrypt", bcrypt('admin'));

async function login(username, password) {
    // console.log(username, password);
    logger.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    // console.log(user, "user from service auth");
    if (!user) throw new Error('Invalid username or password')
    console.log(password);
    console.log(user.password);
    const match = await bcrypt.compare(password, user.password)
    if (!match){
        console.log("oooo");
        throw new Error('Invalid username or password')
    }
    delete user.password
    return user
}

async function signup(username, password, fullname, balance) {
    const saltRounds = 10
    // console.log(username, password, fullname, balance ,msgs);
    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname) throw new Error('Missing details')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ username, password: hash, fullname, balance})
}

function getLoginToken(user) {
    const userInfo = {_id : user._id, fullname: user.fullname, isAdmin: user.isAdmin}
    return cryptr.encrypt(JSON.stringify(userInfo))    
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch(err) {
        console.log('Invalid login token')
    }
    return null
}