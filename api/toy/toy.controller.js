import { toyService } from './toy.service.js'
import { logger } from '../../services/logger.service.js'

export async function getToys(req, res) {
    try {
        let { name, inStock, labels } = req.query
        if(labels && labels.length) labels = labels.split(',')

        const filterBy = {name: name || '',inStock: inStock || '',labels: labels || []}
        logger.debug('Getting Toys', filterBy)

        const toys = await toyService.query(filterBy)
        res.send(toys)
    } catch (err) {
        logger.error('Failed to get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}

export async function getToyById(req, res) {
    try {
        const { id } = req.params
        const toy =  await toyService.getById(id);
        res.send(toy)
    } catch (err) {
        logger.error('Failed to get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

export async function addToy(req, res) {
    const { loggedinUser } = req
    try {
        const { name,inStock,price,labels,msgs,imgUrl } = req.body
        const toy = {
            name,
            inStock,
            price: +price,
            labels,
            msgs,
            imgUrl
        }
        // car.owner = loggedinUser
        const savedToy =  await toyService.add(toy)
        res.send(savedToy)
    } catch (err) {
        logger.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

export async function updateToy(req, res) {
    try {
        const {  name,inStock,price,labels, _id} = req.body
        const toy = {
            _id,
            name,
            inStock,
            price: +price,
            labels
        }
        const savedToy =  await toyService.update(toy)
        res.send(savedToy)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToy(req, res) {
    try {
        const { id } = req.params
        console.log(id,"toyId controller");
        await toyService.remove(id)
        res.send()
    } catch (err) {
        logger.error('Failed to remove toy', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}

export async function addToyMsg(req, res) {
    const { loggedinUser } = req
    const {fullname,_id} = loggedinUser
    // console.log(req.body,"dddd");
    try {
        const toyId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: {fullname,_id},
        }
        const savedMsg = await toyService.addToyMsg(toyId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

// export async function removeToyMsg(req, res) {
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