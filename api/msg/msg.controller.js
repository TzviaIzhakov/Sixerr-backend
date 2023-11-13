import { msgService } from './msg.service.js'
import { logger } from '../../services/logger.service.js'

export async function getMsgs(req, res) {
    try {
        let { txt, email } = req.query
        const filterBy = {
            txt: txt || '',
           email: email || ''
        }
        
        logger.debug('Getting Msgs', filterBy)
        const msgs = await msgService.query(filterBy)
        res.send(msgs)
    } catch (err) {
        logger.error('Failed to get msgs', err)
        res.status(500).send({ err: 'Failed to get msgs' })
    }
}

export async function getMsgById(req, res) {
    try {
        const { id } = req.params
        const msg = await msgService.getById(id);
        res.send(msg)
    } catch (err) {
        logger.error('Failed to get msg', err)
        res.status(500).send({ err: 'Failed to get msg' })
    }
}

export async function addMsg(req, res) {
    const { loggedinUser } = req
    try {
        const { category, createdAt, daysToMake, description, imgUrls, likedByUsers, packages, price, tags, title, owner } = req.body
        const msg = {
            category,
            createdAt,
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
        if (!owner || loggedinUser._id !== msg.owner._id) return res.status(500).send({ err: 'Failed to add msg' })
        const savedMsg = await msgService.add(msg)
        res.send(savedMsg)
    } catch (err) {
        logger.error('Failed to add msg', err)
        res.status(500).send({ err: 'Failed to add msg' })
    }
}

export async function updateMsg(req, res) {
    const { loggedinUser } = req
    try {
        const { _id, category, daysToMake, description, imgUrls, likedByUsers, owner, packages, price, tags, title } = req.body
        const msg = {
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
            title,
        }
        if (!owner || loggedinUser._id !== msg.owner._id) return res.status(500).send({ err: 'Failed to update msg' })
        const savedMsg = await msgService.update(msg)
        res.send(savedMsg)
    } catch (err) {
        logger.error('Failed to update msg', err)
        res.status(500).send({ err: 'Failed to update msg' })
    }
}

export async function removeMsg(req, res) {
    try {
        const { loggedinUser } = req
        const { id } = req.params
        const msg = await msgService.getById(id)

        if (msg.owner._id !== loggedinUser._id) res.status(500).send({ err: 'Failed to remove msg' })
        else await msgService.remove(id)
        res.send()
    } catch (err) {
        logger.error('Failed to remove msg', err)
        res.status(500).send({ err: 'Failed to remove msg' })
    }
}

// export async function addMsgMsg(req, res) {
//     const { loggedinUser } = req
//     const {fullname,_id} = loggedinUser
//     // console.log(req.body,"dddd");
//     try {
//         const msgId = req.params.id
//         const msg = {
//             txt: req.body.txt,
//             by: {fullname,_id},
//         }
//         const savedMsg = await msgService.addMsgMsg(msgId, msg)
//         res.json(savedMsg)
//     } catch (err) {
//         logger.error('Failed to update msg', err)
//         res.status(500).send({ err: 'Failed to update msg' })
//     }
// }

// export async function removeMsgMsg(req, res) {
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