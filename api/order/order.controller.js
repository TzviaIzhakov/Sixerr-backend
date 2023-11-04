import { orderService } from './order.service.js'
import { logger } from '../../services/logger.service.js'

export async function getOrders(req, res) {
    try {
        const orders = await orderService.query()
        res.send(orders)
    }
    catch (err) {
        logger.error('Failed to get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

export async function getOrderById(req, res) {
    try {
        const { id } = req.params
        const order = await orderService.getById(id);
        res.send(order)
    } catch (err) {
        logger.error('Failed to get order', err)
        res.status(500).send({ err: 'Failed to get order' })
    }
}

export async function addOrder(req, res) {
    const { loggedinUser } = req
    try {
        const { buyer, createdAt, daysToMake, gig, packPrice, seller, status, title } = req.body
        const order = {
            buyer,
            createdAt: +createdAt,
            daysToMake: +daysToMake,
            gig,
            packPrice: +packPrice,
            seller,
            status,
            title
        }
        if (loggedinUser._id !== buyer._id) res.status(500).send({ err: 'Failed to add order' })
        const savedOrder = await orderService.add(order)
        res.send(savedOrder)
    } catch (err) {
        logger.error('Failed to add order', err)
        res.status(500).send({ err: 'Failed to add order' })
    }
}

export async function updateOrder(req, res) {
    try {
        const { buyer, createdAt, daysToMake, gig, owner, packPrice, seller, status, title, _id } = req.body
        const order = {
            _id,
            buyer,
            createdAt: +createdAt,
            daysToMake: +daysToMake,
            gig,
            owner,
            packPrice: +packPrice,
            seller,
            status,
            title
        }
        const savedOrder = await orderService.update(order)
        res.send(savedOrder)
    } catch (err) {
        logger.error('Failed to update order', err)
        res.status(500).send({ err: 'Failed to update order' })
    }
}

export async function removeOrder(req, res) {
    try {
        const { id } = req.params
        console.log(id, "orderId controller");
        await orderService.remove(id)
        res.send()
    } catch (err) {
        logger.error('Failed to remove order', err)
        res.status(500).send({ err: 'Failed to remove order' })
    }
}

export async function addOrderMsg(req, res) {
    const { loggedinUser } = req
    const { fullname, _id } = loggedinUser
    // console.log(req.body,"dddd");
    try {
        const orderId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: { fullname, _id },
        }
        const savedMsg = await orderService.addOrderMsg(orderId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update order', err)
        res.status(500).send({ err: 'Failed to update order' })
    }
}

// export async function removeOrderMsg(req, res) {
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