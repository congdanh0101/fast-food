const OrderService = require('../service/OrderService')

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
            voucher: data.voucher,
        }
        try {
            const result = await OrderService.createOrder(order)
            return res.json(result)
        } catch (error) {
            return next(error)
        }
    }

    async getOrderById(req, res, next) {
        const id = req.params.id
        try {
            const order = await OrderService.getOrderById(id)
            return res.json(order)
        } catch (error) {
            return next(error)
        }
    }

    async getAllOrder(req, res, next) {
        const filter = req.query
        try {
            const orders = await OrderService.getAllOrder(filter)
            return res.json(orders)
        } catch (error) {
            return next(error)    
        }
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

        try {
            const orderUpdated = await OrderService.updateOrderById(id, order)
            return res.json(orderUpdated)
        } catch (error) {
            return next(error)
        }
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
