const express = require('express')
const ProductController = require('../controller/ProductController')
const router = express.Router()

router.post('/', ProductController.createProduct)
router.get('/:id', ProductController.getProductById)
router.get('/',ProductController.getAllProducts)
router.delete('/:id',ProductController.deleteProduct)
router.put('/:id',ProductController.updateProductById)

module.exports = router
