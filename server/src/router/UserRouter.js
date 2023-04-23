const express = require('express')
const router = express.Router()
const UserController = require('../controller/UserController')
const Authenticate = require('../middleware/Authenticate')

//get by id
router.get(`/:id`, Authenticate.AuthorizationUSER, UserController.getUserById)
//delete user by id
router.delete('/:id', UserController.deleteUser)
//change password
router.put(
    '/pwd/',
    Authenticate.AuthorizationUSER,
    UserController.changePassword
)
//get all
router.get('/', UserController.getAllUser)
//update user by id
router.put('/', Authenticate.AuthorizationUSER, UserController.updateUser)
//create new user
router.post('/', UserController.createUser)

module.exports = router
