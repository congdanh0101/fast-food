const { default: mongoose } = require('mongoose')
const Product = require('../model/Product')
const Category = require('../model/Category')

class ProductService {
    async createProduct(product) {
        if (!mongoose.isValidObjectId(product['category'])) return `category`
        const category = await Category.findById(product['category'])
        if (!category) return `category`
        const combo = product['combo']
        if (combo) {
            let price = 0
            for (let index = 0; index < combo.length; index++) {
                const id = combo[index]['product']
                const quantity = combo[index]['quantity']
                if (!mongoose.isValidObjectId(id)) return id
                const existProduct = await Product.findById(id)
                if (!existProduct) return id
                price += existProduct['price'] * quantity
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
        ).populate('category')
    }

    async getAllProduct(filter) {
        return await Product.find(filter).populate('category').populate('combo')
    }

    async deleteProduct(id) {
        if (!mongoose.isValidObjectId(id)) return null
        return await Product.findByIdAndRemove(id)
    }
}

module.exports = new ProductService()
