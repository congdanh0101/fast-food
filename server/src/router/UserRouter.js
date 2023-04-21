const express = require('express')
const router = express.Router()
const UserController = require('../controller/UserController')
const Authenticate = require('../middleware/Authenticate')

//get all
router.get('/', UserController.getAllUser)
//get by id
router.get(`/:id`, Authenticate.AuthorizationUSER, UserController.getUserById)
//delete user by id
router.delete('/:id', UserController.deleteUser)
//update user by id
router.put(
    '/pwd/',
    Authenticate.AuthorizationUSER,
    UserController.changePassword
)
router.put('/:id', UserController.updateUser)
//create new user
router.post('/', UserController.createUser)
//change password

module.exports = router
