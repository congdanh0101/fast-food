const CategoryService = require('../service/CategoryService')
const createError = require('http-errors')

class CategoryController {
    //create new category
    async createCategory(req, res, next) {
        const data = { name: req.body.name }
        console.log(data)

        const category = await CategoryService.createCategory(data)
        if (!category) return next(createError.BadRequest())
        return res.json(category)
    }

    //get by id
    async getCategoryById(req, res, next) {
        const category = await CategoryService.getCategoryById(req.params.id)
        if (!category) return next(createError.NotFound())
        return res.json(category)
    }
    
    //get all
    async getAllCategory(req, res, next) {
        res.json(await CategoryService.getAllCategory())
    }
}

module.exports = new CategoryController()
