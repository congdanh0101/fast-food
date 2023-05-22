const Category = require('../model/Category')
const Product = require('../model/Product')
const User = require('../model/User')

class DataChartVisualizeController {
    async getDataOverall() {
        try {
            const listUser = await User.find().countDocuments()
            const listProduct = await Product.find().countDocuments()
            const listCategory = await Category.find().countDocuments()
            
            return { listUser, listProduct }
        } catch (error) {
            throw error
        }
    }
}

module.exports = new DataChartVisualizeController()
