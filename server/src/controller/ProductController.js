const createHttpError = require('http-errors')
const ProductService = require('../service/ProductService')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const { uploadOptions } = require('../utils/multer.config')
class ProductController {
    async createProduct(req, res, next) {
        const data = req.body
        const file = req.file
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/`
        const product = {
            name: data.name,
            category: data.category,
            price: data.price,
            // img: data.img,
            img:`${basePath}${fileName}`,
            combo: data.combo,
        }
        const result = await ProductService.createProduct(product)
        if (!result) return next(createHttpError.BadRequest())
        if (typeof result === 'string') {
            if (result === `category`)
                return next(
                    new ResourceNotFoundException(
                        'Category',
                        'id',
                        product['category']
                    )
                )
            else
                return next(
                    new ResourceNotFoundException('Product', 'id', result)
                )
        }
        return res.status(201).json(result)
    }

    async getProductById(req, res, next) {
        const id = req.params.id
        const product = await ProductService.getProductById(id)
        if (!product)
            return next(new ResourceNotFoundException('Product', 'id', id))
        return res.send(product)
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

    async updateProductById(req, res, next) {
        const data = req.body
        const id = req.params.id
        const product = {
            name: data.name,
            price: data.price,
            category: data.category,
            combo: data.combo,
            img: data.img,
        }
        const result = await ProductService.updateProductById(id, product)

        if (typeof result === 'string') {
            if (result.includes('category')) {
                return next(
                    new ResourceNotFoundException(
                        'Category',
                        'id',
                        product['category']
                    )
                )
            } else
                return next(new ResourceNotFoundException('Product', 'id', result))
        }
        return res.json(result)
    }

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
