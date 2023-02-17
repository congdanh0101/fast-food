const express = require('express')
const router = express.Router()
const UserController = require('../controller/UserController')


//get all
router.get('/',UserController.getAllUser)
//get by id
router.get(`/:id`,UserController.getUserById)
//delete user by id
router.delete('/:id',UserController.deleteUser)
//update user by id
router.put('/:id',UserController.updateUser)


module.exports = router