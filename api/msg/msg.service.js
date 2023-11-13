import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'

export const msgService = {
    remove,
    query,
    getById,
    add,
    update,
}

async function query(filterBy = {txt:'', email: ''}) {
    try {
        const criteria = buildCriteria(filterBy)
        const collection = await dbService.getCollection('msg')
        const msgs = await collection.find(criteria).toArray()
        return msgs
    } catch (err) {
        logger.error('cannot find msgs', err)
        throw err
    }
}

function buildCriteria(filterBy) {
    const criteria = {}
 
    if (filterBy.txt || filterBy.email) {
        const regex = new RegExp(filterBy.txt, 'i');
        criteria.$or = [
            { 'title': { $regex: regex } },
            { 'email': { $regex: regex } }
        ];
    }

    return criteria
}

async function getById(msgId) {
    try {
        const collection = await dbService.getCollection('msg')
        const msg = collection.findOne({ _id: ObjectId(msgId) })
        return msg
    } catch (err) {
        logger.error(`while finding msg ${msgId}`, err)
        throw err
    }
}

async function remove(msgId) {
    try {
        const collection = await dbService.getCollection('msg')
        await collection.deleteOne({ _id: ObjectId(msgId) })
    } catch (err) {
        logger.error(`cannot remove msg ${msgId}`, err)
        throw err
    }
}

async function add(msg) {
    try {
        const collection = await dbService.getCollection('msg')
        await collection.insertOne(msg)
        return msg
    } catch (err) {
        logger.error('cannot insert msg', err)
        throw err
    }
}

async function update(msg) {
    try {
        const msgToSave =
        {
          title:'',
          email: ''
        }
        const collection = await dbService.getCollection('msg')
        await collection.updateOne({ _id: new ObjectId(msg._id) }, { $set: msgToSave })
        console.log(msg._id);
        return msg
    } catch (err) {
        logger.error(`cannot update msg ${msg._id}`, err)
        throw err
    }
}



