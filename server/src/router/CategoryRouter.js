const express = require('express')
const router = express.Router()
const CategoryController = require('../controller/CategoryController')

//create new category
router.post('/', CategoryController.createCategory)
//get category by id
router.get('/:id', CategoryController.getCategoryById)
//get all category
router.get('/',CategoryController.getAllCategory)

module.exports = router
