import { gigService } from './gig.service.js'
import { logger } from '../../services/logger.service.js'

export async function getGigs(req, res) {
    try {
        let { minPrice, maxPrice, txt, category, tags, daysToMake, topRated, basicLevel, premiumLevel, userId } = req.query
        if (tags && tags.length) tags = tags.split(',')
        // console.log(typeof(basicLevel),"basic");
        const filterBy = {
            minPrice: +minPrice || '',
            maxPrice: +maxPrice || '',
            txt: txt || '',
            category: category || '',
            tags: tags || [],
            daysToMake: +daysToMake || '',
            // topRated:topRated || '',
            basicLevel: basicLevel || '',
            premiumLevel: premiumLevel || '',
            userId: userId || ''
        }
        console.log(filterBy, "filterBy");
        logger.debug('Getting Gigs', filterBy)

        const gigs = await gigService.query(filterBy)
        res.send(gigs)
    } catch (err) {
        logger.error('Failed to get gigs', err)
        res.status(500).send({ err: 'Failed to get gigs' })
    }
}

export async function getGigById(req, res) {
    try {
        const { id } = req.params
        const gig = await gigService.getById(id);
        res.send(gig)
    } catch (err) {
        logger.error('Failed to get gig', err)
        res.status(500).send({ err: 'Failed to get gig' })
    }
}

export async function addGig(req, res) {
    const { loggedinUser } = req
    try {
        const { category, daysToMake, description, imgUrls, likedByUsers, packages, price, tags, title, owner } = req.body
        const gig = {
            category,
            daysToMake,
            description,
            imgUrls,
            likedByUsers,
            owner,
            packages,
            price: +price,
            tags,
            title
        }
        const savedGig = await gigService.add(gig)
        res.send(savedGig)
    } catch (err) {
        logger.error('Failed to add gig', err)
        res.status(500).send({ err: 'Failed to add gig' })
    }
}

export async function updateGig(req, res) {

    const { loggedinUser } = req

    try {
        const { _id, category, daysToMake, description, imgUrls, likedByUsers, owner, packages, price, tags, title } = req.body
        const gig = {
            _id,
            category,
            daysToMake,
            description,
            imgUrls,
            likedByUsers,
            owner,
            packages,
            price: +price,
            tags,
            title
        }
        if (loggedinUser._id !== gig.owner._id) return res.status(500).send({ err: 'Failed to update gig' })
        const savedGig = await gigService.update(gig)
        res.send(savedGig)
    } catch (err) {
        logger.error('Failed to update gig', err)
        res.status(500).send({ err: 'Failed to update gig' })
    }
}

export async function removeGig(req, res) {
    try {
        const { loggedinUser } = req
        const { id } = req.params
        const gig = await gigService.getById(id)

        if (gig.owner._id !== loggedinUser._id) res.status(500).send({ err: 'Failed to remove gig' })
        else await gigService.remove(id)
        res.send()
    } catch (err) {
        logger.error('Failed to remove gig', err)
        res.status(500).send({ err: 'Failed to remove gig' })
    }
}

// export async function addGigMsg(req, res) {
//     const { loggedinUser } = req
//     const {fullname,_id} = loggedinUser
//     // console.log(req.body,"dddd");
//     try {
//         const gigId = req.params.id
//         const msg = {
//             txt: req.body.txt,
//             by: {fullname,_id},
//         }
//         const savedMsg = await gigService.addGigMsg(gigId, msg)
//         res.json(savedMsg)
//     } catch (err) {
//         logger.error('Failed to update gig', err)
//         res.status(500).send({ err: 'Failed to update gig' })
//     }
// }

// export async function removeGigMsg(req, res) {
//     const { loggedinUser } = req
//     try {
//         const carId = req.params.id
//         const { msgId } = req.params

//         const removedId = await carService.removeCarMsg(carId, msgId)
//         res.send(removedId)
//     } catch (err) {
//         logger.error('Failed to remove car msg', err)
//         res.status(500).send({ err: 'Failed to remove car msg' })
//     }
// }