import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const gigService = {
    remove,
    query,
    getById,
    add,
    update,
    addGigMsg,
}

async function query(filterBy={name:'',inStock:'',labels:[]}) {
    try {
        const criteria = buildCriteria(filterBy)

        const collection = await dbService.getCollection('gig')
        var gigs = await collection.find(criteria).toArray()
        return gigs
    } catch (err) {
        logger.error('cannot find gigs', err)
        throw err
    }
}

function buildCriteria(filterBy) {
    const criteria = {}
    if(filterBy.inStock){
        criteria.inStock = JSON.parse(filterBy.inStock)
    }
    if(filterBy.name){ 
        criteria.name = { $regex: filterBy.name, $options: 'i' }
    }
    if(filterBy.labels && filterBy.labels.length>0){
        criteria.labels = { $elemMatch: { $in: filterBy.labels } }
    }
    return criteria
}

async function getById(gigId) {
    try {
        const collection = await dbService.getCollection('gig')
        const gig = collection.findOne({ _id: ObjectId(gigId) })
        return gig
    } catch (err) {
        logger.error(`while finding gig ${gigId}`, err)
        throw err
    }
}

async function remove(gigId) {
    try {
        const collection = await dbService.getCollection('gig')
        await collection.deleteOne({ _id: ObjectId(gigId) })
        console.log("ppppppp");
    } catch (err) {
        logger.error(`cannot remove gig ${gigId}`, err)
        throw err
    }
}

async function add(gig) {
    try {
        const collection = await dbService.getCollection('gig')
        await collection.insertOne(gig)
        return gig
    } catch (err) {
        logger.error('cannot insert gig', err)
        throw err
    }
}

async function update(gig) {
    try {
        const gigToSave = {
            name:gig.name,
            inStock: gig.inStock,
            price: +gig.price,
            labels:gig.labels
        }
        const collection = await dbService.getCollection('gig')
        await collection.updateOne({ _id: ObjectId(gig._id) }, { $set: gigToSave })
        return gig
    } catch (err) {
        logger.error(`cannot update gig ${gig_id}`, err)
        throw err
    }
}

// async function addGigMsg(gigId, msg) {
//     try {
//         msg.id = utilService.makeId()
//         const collection = await dbService.getCollection('gig')
//         await collection.updateOne({ _id: ObjectId(gigId) }, { $push: { msgs: msg } })
//         return msg
//     } catch (err) {
//         logger.error(`cannot add gig msg ${gigId}`, err)
//         throw err
//     }
// }

// async function removeCarMsg(carId, msgId) {
//     try {
//         const collection = await dbService.getCollection('car')
//         await collection.updateOne({ _id: ObjectId(carId) }, { $pull: { msgs: {id: msgId} } })
//         return msgId
//     } catch (err) {
//         logger.error(`cannot add car msg ${carId}`, err)
//         throw err
//     }
// }


