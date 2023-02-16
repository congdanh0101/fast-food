const express = require('express')
const router = express.Router()
const AuthController = require('../controller/AuthController')

router.get('/', AuthController.hello)

module.exports = router
