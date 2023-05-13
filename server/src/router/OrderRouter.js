const express = require('express')
const OrderController = require('../controller/OrderController')
const Authenticate = require('../middleware/Authenticate')
const router = express.Router()

router.post('/', Authenticate.AuthorizationUSER, OrderController.createOrder)
router.get('/:id', OrderController.getOrderById)
router.get('/', OrderController.getAllOrder)
router.put('/:id', Authenticate.AuthorizationADMIN, OrderController.updateOrder)

module.exports = router
