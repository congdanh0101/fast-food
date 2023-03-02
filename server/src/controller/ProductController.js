const createHttpError = require('http-errors')
const ProductService = require('../service/ProductService')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const { json } = require('body-parser')

class ProductController {
    async createProduct(req, res, next) {
        const data = req.body
        const product = {
            name: data.name,
            category: data.category,
            price: data.price,
            img: data.img,
            combo: data.combo,
        }
        const result = await ProductService.createProduct(product)
        if (!result) return next(createHttpError.BadRequest())
        if (result === `category`)
            return next(
                new ResourceNotFoundException(
                    'Category',
                    'id',
                    product['category']
                )
            )
        if (result === `product`)
            return next(createHttpError.NotFound(`Product not found`))
        return res.status(201).json(result)
    }

    async getProductById(req, res, next) {
        const id = req.params.id
        const product = await ProductService.getProductById(id)
        if (!product)
            return next(new ResourceNotFoundException('Product', 'id', id))
        return res.json(product)
    }

    async getAllProducts(req, res, next) {
        let filter = {}
        const softDeleted =
            req.query.softDeleted == 1 ? req.query.softDeleted : 0
        if (req.query.category) {
            filter['category'] = req.query.category.split(',')
        }
        filter['softDeleted'] = softDeleted

        const listProduct = await ProductService.getAllProduct(filter)
        if (!listProduct) return next(createHttpError.InternalServerError())
        return res.json(listProduct)
    }

    async getAllProductByCategory(req, res, next) {}

    async updateProductById(req, res, next) {}

    async deleteProduct(req, res, next) {
        const id = req.params.id
        const result = await ProductService.deleteProduct(id)
        if (!result)
            return next(new ResourceNotFoundException('Product', 'id', id))
        return res.json({
            status: `success`,
            message: `Product with id=${id} has been deleted!`,
        })
    }
}

module.exports = new ProductController()
