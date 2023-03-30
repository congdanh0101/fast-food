const PaymentService = require('../service/PaymentService')
const Utils = require('../utils/Utils')
const moment = require('moment')
require('dotenv').config()
const responeCode = require('../utils/vnpay.statuscode')
const createHttpError = require('http-errors')

class PaymentController {
    async CreatePaymentURL(req, res, next) {
        var ipAddr =
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress
        const data = req.body
        const paymentRequest = {
            ipAddr: ipAddr,
            bankCode: null,
            locale: data.language,
            orderID:data.orderID
        }

        try {
            const payment = await PaymentService.createPaymentUrl(
                paymentRequest
            )
            res.json({ payment })
        } catch (error) {
            return next(error)
        }
    }

    async vnpayReturn(req, res, next) {
        try {
            let vnp_Params = req.query
            const result = await PaymentService.vnpayReturn(vnp_Params)

            if (result.code === '00') {
                const code = result.code
                const message = result.message
                const order = result.updateOrder
                return res.json({ code, message, order })
            } else throw createHttpError.InternalServerError(result.message)
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = new PaymentController()
