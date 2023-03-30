const express = require('express')
const PaymentController = require('../controller/PaymentController')
const router = express.Router()

router.get('/create_payment_url')
router.post('/create_payment_url/', PaymentController.CreatePaymentURL)
router.get('/vnpay_return', PaymentController.vnpayReturn)
router.get('/vnpay_ipn')

module.exports = router
