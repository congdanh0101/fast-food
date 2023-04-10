const express = require('express')
const ProductController = require('../controller/ProductController')
const uploadOptions = require('../utils/multer.config')
const router = express.Router()

router.post('/', uploadOptions.single('img'), ProductController.createProduct)
router.get('/:id', ProductController.getProductById)
router.get('/', ProductController.getAllProducts)
router.delete('/:id', ProductController.deleteProduct)
router.put('/:id',uploadOptions.single('img'), ProductController.updateProductById)

module.exports = router
