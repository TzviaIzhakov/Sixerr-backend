import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'

import mongodb from 'mongodb'
const { ObjectId } = mongodb

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    // const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find({}).toArray()
        users = users.map(user => {
            delete user.password
            // user.createdAt = ObjectId(user._id).getTimestamp()
            // Returning fake fresh data
            // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

// async function getById(userId) {
//     try {
//         const collection = await dbService.getCollection('user')
//         const user = await collection.findOne({ _id: ObjectId(userId) })
//         // const user = await collection.findOne({ _id: userId })
//         // console.log("user",user);
//         delete user.password
//         return user
//     } catch (err) {
//         logger.error(`while finding user ${userId}`, err)
//         throw err
//     }
// }


async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')

        // Check if userId is a valid ObjectId
        const isObjectId = ObjectId.isValid(userId)
        const query = isObjectId ? { _id: ObjectId(userId) } : { _id: userId }
        const user = await collection.findOne(query)
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }
        delete user.password
        return user

    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    console.log('username for mongo:', username)
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        // console.log(user,"user");
        return user
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ _id: ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    console.log(user, 'update******************')
    //Check if userId is objectId or DemoData
    const isObjectId = ObjectId.isValid(user._id)
    try {
        // peek only updatable fields!
        const userToSave = {
            _id: isObjectId ? ObjectId(user._id) : user._id,
            username: user.username,
            fullname: user.fullname,
            reviews: user.reviews,
            isSeller: user.isSeller
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    // console.log(user,"add from servoce");
    try {
        // Validate that there are no such user:
        const existUser = await getByUsername(user.username)
        if (existUser) throw new Error('Username taken')

        // peek only updatable fields!
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            imgUrl: user.imgUrl || '',
            desc: '',
            isSeller: false,
            lang: ["English", "Hebrew"],
            level: 1,
            location: 'Israel',
            reviews: []
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    if (filterBy.minBalance) {
        criteria.balance = { $gte: filterBy.minBalance }
    }
    return criteria
}