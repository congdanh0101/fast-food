const express = require('express')
const router = express.Router()
const UserController = require('../controller/UserController')
const Authenticate = require('../middleware/Authenticate')

//get by id
//delete user by id
// router.delete('/:id', UserController.deleteUser)
//change password
router.put(
    '/pwd/',
    Authenticate.AuthorizationUSER,
    UserController.changePassword
)
router.put(
    '/soft/:id',
    Authenticate.AuthorizationADMIN,
    UserController.changeSoftDeleted
)
//get all
router.get('/', UserController.getAllUser)
//update user by id
router.put('/', Authenticate.AuthorizationUSER, UserController.updateUser)
//create new user
router.post('/', UserController.createUser)

router.get(
    '/discount',
    Authenticate.AuthorizationUSER,
    UserController.getDiscountByRanking
)
router.get(`/:id`, Authenticate.AuthorizationUSER, UserController.getUserById)

module.exports = router
