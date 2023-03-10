const { default: mongoose, mongo } = require('mongoose')
const Product = require('../model/Product')
const Category = require('../model/Category')
const CategoryService = require('./CategoryService')
const Utils = require('../utils/Utils')

class ProductService {
    async createProduct(product) {
        if (!mongoose.isValidObjectId(product['category'])) return `category`
        const category = await Category.findById(product['category'])
        if (!category) return `category`
        const combo = product['combo']
        if (combo && combo.length > 0) {
            let [priceResult, comboResult] = await Utils.getPriceOfCombo(combo)
            if (typeof priceResult === 'string') return priceResult
            product['price'] = priceResult
            product['combo'] = comboResult
        }

        const p = new Product(product)
        return await p.save()
    }

    async getProductById(id) {
        if (!mongoose.isValidObjectId(id)) return null
        return await Product.findByIdAndUpdate(
            id,
            { $inc: { view: 1 } },
            { new: true }
        ).populate('category')
    }

    async getAllProduct(filter) {
        return await Product.find(filter).populate('category')
    }

    async deleteProduct(id) {
        if (!mongoose.isValidObjectId(id)) return null
        return await Product.findByIdAndRemove(id)
    }

    async softDeleteProductById(id) {}

    async updateProductById(id, product) {
        //valid id
        if (!mongoose.isValidObjectId(product['category'])) return `category`
        if (!mongoose.isValidObjectId(id)) return id
        //Check category has in db
        const cate = await CategoryService.getCategoryById(product['category'])
        if (!cate) return `category`
        //check combo not null
        const combo = product['combo']
        // if (combo && combo.length > 0) {
        //     //Calculate price of product
        //     let price = 0
        //     for (let index = 0; index < combo.length; index++) {
        //         const id = combo[index]['product']
        //         const quantity = combo[index]['quantity']
        //         if (!mongoose.isValidObjectId(id)) return id
        //         const existProduct = await Product.findById(id)
        //         if (!existProduct) return id
        //         price += existProduct['price'] * quantity
        //     }
        //     product['price'] = price
        // }

        if (combo && combo.length > 0) {
            let [priceResult, comboResult] = await Utils.getPriceOfCombo(combo)
            if (typeof priceResult === 'string') return priceResult
            product['price'] = priceResult
            product['combo'] = comboResult
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, product, {
            new: true,
        })
        if (!updatedProduct) return `product`
        return updatedProduct
    }
}

module.exports = new ProductService()
