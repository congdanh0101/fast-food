const jwt = require('jsonwebtoken')
require('dotenv').config()
const createError = require('http-errors')
const uuid = require('uuid')
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
            maxAge: age === 0 ? null : age*1000,
        })
    }
}

module.exports = new Utils()
