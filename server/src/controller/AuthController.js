const AuthService = require('../service/AuthService')
const createError = require('http-errors')
var { validationResult } = require('express-validator')
const Utils = require('../utils/Utils')
const Authenticate = require('../middleware/Authenticate')
const jwt = require('jsonwebtoken')

class AuthController {
    hello(req, res, next) {
        const err = {
            status: 400,
            message: 'zz',
        }
        // next(err)
        res.send(`hello everybody`)
    }
    async register(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() })

        const data = req.body
        const registerUser = {
            fullName: data.fullName,
            dob: data.dob,
            gender: data.gender,
            address: data.address,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
            phoneNumber: data.phoneNumber,
        }
        const result = await AuthService.register(registerUser)

        if (result === `email`)
            return next(createError.BadRequest('Please try another email!'))
        if (result === `phone`)
            return next(
                createError.BadRequest('Please try another phone number!')
            )
        if (result === `password`)
            return next(
                createError.BadRequest(
                    'Password does not match, please try again!'
                )
            )

        return res.send(result)
    }

    async login(req, res, next) {
        const data = req.body
        const loginRequest = {
            username: data.username,
            password: data.password,
        }
        const token = await AuthService.login(loginRequest)
        if (!token)
            return next(createError.BadRequest('Invalid username or password'))
        if (token === `deleted`)
            return next(
                createError.InternalServerError(`User had been deleted`)
            )
        //cookie configuration for refresh token
        res.cookie('refreshToken', token['refreshToken'], {
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'strict',
        })
        return res.json({ accessToken: token['accessToken'] })
    }

    async refreshToken(req, res, next) {
        try {
            //get refresh token from cookie
            const refreshToken = req.cookies.refreshToken
            var userID
            if (!refreshToken) return next(createError.BadRequest())
            //verify jwt refresh token to generate new access token
            jwt.verify(
                refreshToken,
                process.env.API_SECRET_REFRESH_KEY,
                (error, payload) => {
                    if (error)
                        return res.status(403).json({
                            message: 'Access Denied!',
                            error: error,
                            success: false,
                        })
                    userID = payload['userID']
                }
            )
            //generate new access token + refresh token
            const newToken = await AuthService.refreshAccessToken(userID)
            //cookie configuration for refresh token
            res.cookie('refreshToken', newToken['refreshToken'], {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            })
            return res.json({ accessToken: newToken['accessToken'] })
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        const userID = req.user.userID
        //clear refresh token in cookie and database
        const result = await AuthService.logout(userID)
        if (!result) return next()
        res.clearCookie('refreshToken')
        return res.json({ message: `Logout successfully` })
    }
}

module.exports = new AuthController()
