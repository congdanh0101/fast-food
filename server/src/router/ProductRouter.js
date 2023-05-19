const express = require('express')
const ProductController = require('../controller/ProductController')
// const uploadOptions = require('../utils/multer.config')
const upload = require('../utils/multer.config')
const router = express.Router()
const Auth = require('../middleware/Authenticate')
const Authenticate = require('../middleware/Authenticate')

router.post('/', upload.single('img'), ProductController.createProduct)
router.get('/:id', ProductController.getProductById)
router.get('/', ProductController.getAllProducts)
router.put(
    '/soft/:id',
    Authenticate.AuthorizationADMIN,
    ProductController.changeSoftDeleted
)
router.put('/:id', upload.single('img'), ProductController.updateProductById)

module.exports = router
