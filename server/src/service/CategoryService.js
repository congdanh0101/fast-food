const Category = require('../model/Category')
const mongoose = require('mongoose')
class CategoryService {
    async getCategoryByName(data) {
        const category = await Category.findOne({ name: data })
        if (!category) return null
        return category
    }
    async getCategoryById(id) {
        if (await !mongoose.isValidObjectId(id)) return null
        const category = await Category.findById(id)
        if (!category) null
        return category
    }

    async createCategory(data) {
        if (!data.name || data.name === '') return null
        return await new Category(data).save()
    }
    getAllCategory = () => Category.find()

    async updateCategory(id, data) {
        if (!mongoose.isValidObjectId(id)) return null
        return await Category.findByIdAndUpdate(id, data, { new: true })
    }
}

module.exports = new CategoryService()
