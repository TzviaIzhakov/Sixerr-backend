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
}

async function query(filterBy = { minPrice: '', maxPrice: '', txt: '', category: '', tags: [], daysToMake: '', topRated: '', basicLevel: '', premiumLevel: '', userId: '', sortBy: '' }) {
    try {
        const criteria = buildCriteria(filterBy)
        const collection = await dbService.getCollection('gig')
        let cursor = collection.find(criteria);

        if (filterBy.sortBy) {
            switch (filterBy.sortBy) {
                case 'new':
                    cursor = cursor.sort({ createdAt: -1 }); // Sort by createdAt in descending order (newest first)
                    break;
                case 'recommend':
                    cursor = cursor.sort({ 'owner.rate': -1 }); // Sort by owner's rate in descending order (highest rate first)
                    break;
            }
        }

        const gigs = await cursor.toArray();
        return gigs
    } catch (err) {
        logger.error('cannot find gigs', err)
        throw err
    }
}

function buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.minPrice || filterBy.maxPrice) criteria['packages.basic.packPrice'] = {};

    if (filterBy.minPrice && filterBy.maxPrice) {
        if (filterBy.minPrice > filterBy.maxPrice) {
            // Swap minPrice and maxPrice
            // const temp = filterBy.minPrice;
            // filterBy.minPrice = filterBy.maxPrice;
            // filterBy.maxPrice = temp;
            [filterBy.minPrice, filterBy.maxPrice] = [filterBy.maxPrice,filterBy.minPrice]
            criteria['packages.basic.packPrice'] = {
                $gte: filterBy.minPrice,
                $lte: filterBy.maxPrice
            }
        } else {
            // Use the $gte and $lte operators directly
            criteria['packages.basic.packPrice'] = {
                $gte: filterBy.minPrice,
                $lte: filterBy.maxPrice
            }
        }
    }

    else if (filterBy.minPrice) {
        criteria['packages.basic.packPrice'] = {$gte :filterBy.minPrice};
    }

    else if (filterBy.maxPrice) {
        criteria['packages.basic.packPrice'] = {$lte: filterBy.maxPrice}
    }

    if (filterBy.category) {
        criteria.category = filterBy.category;
    }

    if (filterBy.tags && filterBy.tags.length > 0) {
        criteria.tags = { $elemMatch: { $in: filterBy.tags } }
    }

    if (filterBy.userId) {
        criteria['owner._id'] = filterBy.userId;
    }

    if (filterBy.daysToMake) {
        criteria['packages.basic.packDaysToMake'] = { $lte: filterBy.daysToMake };
    }


    //check if works
    if (filterBy.topRated) {
        criteria['owner.rate'] = { $gte: 5 };
    }
    //need to work
    if (filterBy.basicLevel && filterBy.premiumLevel) {
        criteria['owner.level'] = { $in: [1, 2] };
    } else if (filterBy.basicLevel) {
        criteria['owner.level'] = 1;
    } else if (filterBy.premiumLevel) {
        criteria['owner.level'] = 2;
    }

    //works!!
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i');
        criteria.$or = [
            { 'tags': { $elemMatch: { $regex: regex } } },
            { 'title': { $regex: regex } },
            { 'description': { $regex: regex } }
        ];
    }

    // if (filterBy.sortBy) {
    //     switch (filterBy.sortBy) {
    //         case 'new':
    //             criteria.$sort = { createdAt: -1 }; // Sort by createdAt in descending order (newest first)
    //             break;
    //         case 'recommend':
    //             criteria.$sort = { 'owner.rate': -1 }; // Sort by owner's rate in descending order (highest rate first)
    //             break;
    //     }
    // }
    console.log(criteria, "Criteria ***");
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
        const gigToSave =
        {
            category: gig.category,
            daysToMake: gig.daysToMake,
            description: gig.description,
            imgUrls: gig.imgUrls,
            likedByUsers: gig.likedByUsers,
            packages: gig.packages,
            price: +gig.price,
            tags: gig.tags,
            title: gig.title
        }
        const collection = await dbService.getCollection('gig')
        await collection.updateOne({ _id: new ObjectId(gig._id) }, { $set: gigToSave })
        console.log(gig._id);
        return gig
    } catch (err) {
        logger.error(`cannot update gig ${gig._id}`, err)
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


