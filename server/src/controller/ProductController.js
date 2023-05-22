const createHttpError = require('http-errors')
const ProductService = require('../service/ProductService')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const { uploadOptions } = require('../utils/multer.config')
const uploadImage = require('../utils/uploadImage')
class ProductController {
    async createProduct(req, res, next) {
        const data = req.body
        const file = req.file
        const fileName = file ? file.originalname : null
        const basePath = `${req.protocol}://${req.get('host')}/public/`
        console.log(file)
        const link = await uploadImage(file)
        console.log(link)
        // console.log(file.location)

        const product = {
            name: data.name,
            category: data.category,
            price: data.price,
            // img: data.img,
            img: link['Location'] || null,
            combo: data.combo,
            description: data.description,
        }
        try {
            const result = await ProductService.createProduct(product)
            return res.status(201).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async getProductById(req, res, next) {
        const id = req.params.id
        try {
            const product = await ProductService.getProductById(id)
            return res.status(200).json(product)
        } catch (error) {
            return next(error)
        }
    }

    async getAllProducts(req, res, next) {
        // let filter = req.query
        let filter = {}
        const softDeleted =
            req.query.softDeleted == 1 ? req.query.softDeleted : 0
        if (req.query.category) {
            filter['category'] = req.query.category.split(',')
        }
        if (req.query.softDeleted) {
            filter['softDeleted'] = req.query.softDeleted
        }
        // filter['softDeleted'] = softDeleted
        console.log(filter)
        // filter = req.query
        try {
            const listProduct = await ProductService.getAllProduct(filter)
            return res.json(listProduct)
        } catch (error) {
            return next(error)
        }
    }

    async getAllProductByCategory(req, res, next) {}

    async updateProductById(req, res, next) {
        const data = req.body
        const id = req.params.id
        const file = req.file
        const fileName = file ? file.filename : null
        const basePath = `${req.protocol}://${req.get('host')}/public/`
        const product = {
            name: data.name,
            price: data.price,
            category: data.category,
            combo: data.combo,
            img: fileName ? `${basePath}${fileName}` : null,
            // img: `${basePath}${fileName}`,
            description: data.description,
        }

        try {
            const result = await ProductService.updateProductById(id, product)
            return res.status(200).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async deleteProduct(req, res, next) {
        const id = req.params.id
        try {
            const result = await ProductService.deleteProduct(id)
            return res.json({
                status: `success`,
                message: `Sản phẩm với id=${id} đã bị xoá!`,
            })
        } catch (error) {
            return next(error)
        }
    }

    async changeSoftDeleted(req, res, next) {
        try {
            const id = req.params.id
            const product = await ProductService.changeSoftDeleted(id)
            return res.json(product)
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = new ProductController()
