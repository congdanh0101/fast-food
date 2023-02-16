const express = require('express')
const router = express.Router()
const AuthController = require('../controller/AuthController')
const { validate } = require('../middleware/Validator')
router.get('/', AuthController.hello)

//register new user
router.post(
  '/register',
  validate.validateRegisterUser(),
  AuthController.register
)

module.exports = router
