const createHttpError = require('http-errors')
const OrderService = require('../service/OrderService')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')

class OrderController {
    async createOrder(req, res, next) {
        const data = req.body
        const userID = req.userID
        console.log(userID)
        const order = {
            items: data.items,
            user: userID,
            isPaid: data.isPaid,
            deliveryMethod: data.deliveryMethod,
            payment: data.payment,
        }
        const result = await OrderService.createOrder(order)
        if (!result) return next(createHttpError.BadRequest())
        return res.json(result)
    }

    async getOrderById(req, res, next) {
        const id = req.params.id
        const order = await OrderService.getOrderById(id)
        if (!order)
            return next(new ResourceNotFoundException('Order', 'id', id))
        return res.json(order)
    }

    async getAllOrder(req, res, next) {
        const filter = req.query
        const orders = await OrderService.getAllOrder(filter)
        if (!orders) return next(createHttpError.InternalServerError())
        return res.json(orders)
    }

    async updateOrder(req, res, next) {
        const id = req.params.id
        const data = req.body
        const order = {
            isPaid: data.isPaid,
            deliveryMethod: data.deliveryMethod,
            payment: data.payment,
            status: data.status,
        }

        const [status, orderUpdated] = await OrderService.updateOrderById(
            id,
            order
        )
        if (status === 404)
            return next(new ResourceNotFoundException('Order', 'id', id))
        return res.status(status).json(orderUpdated)
    }

    async updateStatusOrder(req, res, next) {
        // const id = req.params.id
        // const status = req.body.status
        // const [statusCode, order] = await OrderService.updateStatusOrderById(
        //     id,
        //     status
        // )
        // if (statusCode !== 200) {
        //     if (!order)
        //         return next(new ResourceNotFoundException('Order', 'id', id))
        // }
        // return res.status(statusCode).json(order)
    }
}

module.exports = new OrderController()
