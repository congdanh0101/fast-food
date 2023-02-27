const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const CategoryService = require('../service/CategoryService')
const createError = require('http-errors')
const Utils = require('../utils/Utils')

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
        Utils.setCookie(res, 'cookie', 'haha')
        res.json(await CategoryService.getAllCategory())
    }

    async updateCategory(req, res, next) {
        const cate = { name: req.body.name }
        const category = await CategoryService.updateCategory(
            req.params.id,
            cate
        )
        if (!category)
            return next(
                new ResourceNotFoundException(`Category`, `id`, req.params.id)
            )
        return res.json(category)
    }
}

module.exports = new CategoryController()
