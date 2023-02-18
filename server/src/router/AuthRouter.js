const express = require('express')
const router = express.Router()
const AuthController = require('../controller/AuthController')
const { validate } = require('../middleware/Validator')
const Authenticate = require('../middleware/Authenticate')
router.get('/', AuthController.hello)

//register new user
router.post(
    '/register',
    validate.validateRegisterUser(),
    AuthController.register
)
router.post('/login', AuthController.login)
router.post('/refreshtoken', AuthController.refreshToken)
router.post(
    '/logout',
    Authenticate.verifyUSERAuthorization,
    AuthController.logout
)

module.exports = router
