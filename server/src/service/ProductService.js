const { default: mongoose, mongo } = require('mongoose')
const Product = require('../model/Product')
const Category = require('../model/Category')
const CategoryService = require('./CategoryService')
const Utils = require('../utils/Utils')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const createHttpError = require('http-errors')

class ProductService {
    async createProduct(product) {
        try {
            const category = await CategoryService.getCategoryById(
                product['category']
            )
            if (!category)
                throw new ResourceNotFoundException(
                    'Category',
                    'id',
                    product['category']
                )
            const combo = product['combo']
            console.log(combo)
            if (combo && combo.length > 0) {
                let [priceResult, comboResult] = await Utils.getPriceOfItems(
                    combo
                )
                product['price'] = priceResult
                product['combo'] = comboResult
            }

            const p = new Product(product)
            return await p.save()
        } catch (error) {
            throw error
        }
    }

    async getProductById(id) {
        try {
            if (!mongoose.isValidObjectId(id))
                throw new ResourceNotFoundException('Product', 'id', id)
            const product = await Product.findByIdAndUpdate(
                id,
                { $inc: { view: 1 } },
                { new: true }
            )
                .populate('category')
                .populate('combo.product', 'name category price -_id')
            if (!product)
                throw new ResourceNotFoundException('Product', 'id', id)
            return product
        } catch (error) {
            throw error
        }
    }

    async getAllProduct(filter = {}) {
        try {
            const listProduct = await Product.find(filter)
                .populate('category')
                .populate('combo.product', 'name category price -_id')
            return listProduct
        } catch (error) {
            throw error
        }
    }

    async deleteProduct(id) {
        try {
            if (!mongoose.isValidObjectId(id))
                throw new ResourceNotFoundException('Product', 'id', id)
            const product = await Product.findByIdAndRemove(id)
            if (!product)
                throw new ResourceNotFoundException('Product', 'id', id)
        } catch (error) {
            throw error
        }
    }

    async softDeleteProductById(id) {
        if (!mongoose.isValidObjectId(id)) return null
        return await Product.findByIdAndUpdate(
            id,
            { softDeleted: 1 },
            { new: true }
        )
    }

    async updateProductById(id, product) {
        try {
            const category = await CategoryService.getCategoryById(
                product['category']
            )
            if (!category)
                throw new ResourceNotFoundException(
                    'Category',
                    'id',
                    product['category']
                )
            //check combo not null
            const combo = product['combo']
            if (combo && combo.length > 0) {
                let [priceResult, comboResult] = await Utils.getPriceOfItems(
                    combo
                )
                product['price'] = priceResult
                product['combo'] = comboResult
            }

            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                product,
                {
                    new: true,
                }
            )
            if (!updatedProduct)
                throw new Error('Product not found or something went wrong')
            return updatedProduct
        } catch (error) {
            throw error
        }
    }
}

module.exports = new ProductService()
