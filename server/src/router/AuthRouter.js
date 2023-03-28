const express = require('express')
const router = express.Router()
const AuthController = require('../controller/AuthController')
const { validate } = require('../middleware/Validator')
const Authenticate = require('../middleware/Authenticate')
router.get('/', AuthController.hello)

//register new user
router.post(
    '/register',
    // validate.validateRegisterUser(),
    AuthController.register
)
router.post('/login', AuthController.login)
router.put('/refreshtoken', AuthController.refreshToken)
router.delete('/logout', Authenticate.AuthorizationUSER, AuthController.logout)
router.post('/verify/**', AuthController.verifyEmailCode)
router.post('/forgot', AuthController.forgotPassword)

module.exports = router
