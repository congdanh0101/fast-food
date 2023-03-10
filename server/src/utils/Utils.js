const jwt = require('jsonwebtoken')
require('dotenv').config()
const createError = require('http-errors')
const uuid = require('uuid')
const { default: mongoose } = require('mongoose')
const Product = require('../model/Product')
class Utils {
    generateAccessToken = (payload) =>
        jwt.sign(payload, process.env.API_SECRET_ACCESS_KEY, {
            expiresIn: '1m',
            algorithm: 'HS512',
        })
    generateRefreshToken = (payload) =>
        jwt.sign(payload, process.env.API_SECRET_REFRESH_KEY, {
            expiresIn: '365d',
            algorithm: 'HS512',
        })
    generateVerificationCode = () => uuid.v4().split('-')[0].toUpperCase()
    generateRandomResetPassword = () =>
        uuid.v4().split('-')[0] + uuid.v4().split('-')[4]

    setCookie = (res, key, value, age = 0) => {
        res.cookie(key, value, {
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'strict',
            // expires: age === 0 ? 0 : new Date(Date.now() + age),
            maxAge: age === 0 ? null : age * 1000,
        })
    }

    getPriceOfCombo = async (combo) => {
        let price = 0
        let position = []
        for (let index = 0; index < combo.length; index++) {
            const id = combo[index]['product']
            const quantity = combo[index]['quantity']
            if (!id || !quantity) {
                //push index to array position
                position.push(index)
                continue
            }
            //valid id
            if (!mongoose.isValidObjectId(id)) return id
            //find product
            const existProduct = await Product.findById(id)
            if (!existProduct) return id
            //calculate price of combo
            price += existProduct['price'] * quantity
        }
        //set null for element of combo does not have id or quantity
        position.forEach((index) => (combo[index] = null))
        //get combo with item not null
        combo = combo.filter((item) => item !== null)
        return [price, combo]
    }
}

module.exports = new Utils()
