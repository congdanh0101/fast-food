require('dotenv').config()
const dateFormat = require('dateformat')
const Utils = require('../utils/Utils')
const querystring = require('qs')
const crypto = require('crypto')
const moment = require('moment')
const responeCode = require('../utils/vnpay.statuscode')
const { default: mongoose } = require('mongoose')
const OrderService = require('./OrderService')
const createHttpError = require('http-errors')
class PaymentService {
    async createPaymentUrl(data) {
        try {
            const idOrder = data['orderID']
            const order = await OrderService.getOrderById(idOrder)
            if (order['isPaid'] === true)
                throw createHttpError.BadRequest('Order is paid')
            process.env.TZ = 'Asia/Ho_Chi_Minh'
            var tmnCode = process.env.vnp_TmnCode
            var secretKey = process.env.vnp_HashSecret
            var vnpUrl = process.env.vnp_Url
            var returnUrl = process.env.vnp_ReturnUrl
            var date = new Date()
            let createDate = moment(date).format('YYYYMMDDHHmmss')
            let orderId = moment(date).format('DDHHmmss')
            if (data['locale'] === null || data['locale'] === '') {
                data['locale'] = 'vn'
            }
            var currCode = 'VND'
            var vnp_Params = {}
            vnp_Params['vnp_Version'] = '2.1.0'
            vnp_Params['vnp_Command'] = 'pay'
            vnp_Params['vnp_TmnCode'] = tmnCode
            // vnp_Params['vnp_Merchant'] = ''
            vnp_Params['vnp_Locale'] = data['locale']
            vnp_Params['vnp_CurrCode'] = currCode
            vnp_Params['vnp_TxnRef'] = orderId
            vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD: ' + idOrder
            vnp_Params['vnp_OrderType'] = 'topup'
            vnp_Params['vnp_Amount'] = order['subtotal'] * 100
            vnp_Params['vnp_ReturnUrl'] = returnUrl
            vnp_Params['vnp_IpAddr'] = data['ipAddr']
            vnp_Params['vnp_CreateDate'] = createDate
            if (data['bankCode'] !== null && data['bankCode'] !== '') {
                vnp_Params['vnp_BankCode'] = data['bankCode']
            }
            vnp_Params = Utils.sortObject(vnp_Params)
            var signData = querystring.stringify(vnp_Params, { encode: false })
            var hmac = crypto.createHmac('sha512', secretKey)
            var signed = hmac
                .update(new Buffer(signData, 'utf-8'))
                .digest('hex')
            vnp_Params['vnp_SecureHash'] = signed
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false })
            return vnpUrl
        } catch (error) {
            throw error
        }
    }

    vnpayReturn = async (vnp_Params) => {
        try {
            let secureHash = vnp_Params['vnp_SecureHash']

            delete vnp_Params['vnp_SecureHash']
            delete vnp_Params['vnp_SecureHashType']

            vnp_Params = Utils.sortObject(vnp_Params)

            let secretKey = process.env.vnp_HashSecret

            let signData = querystring.stringify(vnp_Params, { encode: false })
            let orderinfo = querystring.parse(vnp_Params['vnp_OrderInfo'])
            const idOrder = Object.keys(orderinfo)[0].split(': ')[1]

            const updateOrderRequest = {
                status: 'Pending',
                isPaid: true,
                payment: 'Online',
            }
            let updateOrder

            let hmac = crypto.createHmac('sha512', secretKey)
            let signed = hmac
                .update(new Buffer.from(signData, 'utf-8'))
                .digest('hex')
            if (secureHash === signed) {
                //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
                const code = vnp_Params['vnp_ResponseCode']
                if (code === '00') {
                    updateOrder = await OrderService.updateOrderById(
                        idOrder,
                        updateOrderRequest
                    )
                }
                const message = responeCode['vnp_ResponseCode'][code]
                return { code, message, updateOrder }
            } else {
                return { code: '97' }
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = new PaymentService()
