const { default: mongoose } = require('mongoose')
const Product = require('../model/Product')
const Category = require('../model/Category')
const { deleteProduct } = require('../controller/ProductController')

class ProductService {
    async createProduct(product) {
        if (!mongoose.isValidObjectId(product['category'])) return `category`
        const category = await Category.findById(product['category'])
        if (!category) return `category`
        const listProduct = product['combo']
        if (listProduct) {
            let price = 0
            for (let index = 0; index < listProduct.length; index++) {
                if (!mongoose.isValidObjectId(listProduct[index]))
                    return `product`
                const existProduct = await Product.findById(listProduct[index])
                if (!existProduct) return `product`
                price += existProduct['price']
            }
            product['price'] = price
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
        )
    }

    async getAllProduct(filter) {
        return await Product.find(filter).populate('category')
    }

    async deleteProduct(id) {
        if (!mongoose.isValidObjectId(id)) return null
        return await Product.findByIdAndRemove(id)
    }
}

module.exports = new ProductService()
