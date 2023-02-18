const jwt = require('jsonwebtoken')
require('dotenv').config()
const createError = require('http-errors')

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
}

module.exports = new Utils()
