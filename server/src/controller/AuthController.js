const AuthService = require('../service/AuthService')
const createError = require('http-errors')
var { validationResult } = require('express-validator')
const Utils = require('../utils/Utils')
const Authenticate = require('../middleware/Authenticate')
const jwt = require('jsonwebtoken')
const UserService = require('../service/UserService')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')

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
        const registerVerificationCode = result
        Utils.setCookie(
            res,
            'registerVerificationCode',
            registerVerificationCode,
            process.env.VERIFICATION_CODE_EXPIRED
        )
        console.log(registerUser)
        // Utils.setCookie(res, 'timeVerificationCode', timeVerificationCode)
        Utils.setCookie(
            res,
            'user',
            registerUser,
            process.env.VERIFICATION_CODE_EXPIRED
        )
        return res.status(200).json({
            message: `Verification code is sent to your email.`,
            code: registerVerificationCode,
            user: registerUser,
        })
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
        Utils.setCookie(res, 'refreshToken', token['refreshToken'])
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
            Utils.setCookie(res, 'refreshToken', newToken['refreshToken'])

            return res.json({ accessToken: newToken['accessToken'] })
        } catch (error) {
            next(error)
        }
    }

    async verifyEmailCode(req, res, next) {
        const codeInput = req.body.code
        // const expired = process.env.VERIFICATION_CODE_EXPIRED
        // const now = new Date().getTime()
        const path = req.path
        // const timeVerificationCode = req.cookies.timeVerificationCode
        //Check time expired
        // if (now - timeVerificationCode > expired) {
        //     return res.status(406).json({
        //         success: false,
        //         message: `Token is expired`,
        //     })
        // } else {
        if (path.includes('register')) {
            //get email verification code

            const emailVerficationCode = req.cookies.registerVerificationCode

            console.log(emailVerficationCode)
            console.log(req.headers.ck)

            //check token
            if (codeInput === emailVerficationCode) {
                const user = await UserService.createUser(req.cookies.user)
                res.clearCookie('registerVerificationCode')
                res.clearCookie('user')
                if (!user) return next(createError.InternalServerError())
                return res.json(user)
            } else if (emailVerficationCode == undefined)
                return res.status(406).json({
                    success: false,
                    message: `Token is expired`,
                })
            else
                return next(
                    createError.BadRequest(`Invalid email verification code`)
                )
        } else if (path.includes('forgot')) {
            const emailVerficationCode = req.cookies.forgotVerificationCode
            const email = req.cookies.email
            if (codeInput === emailVerficationCode) {
                const user = await AuthService.resetPassword(email)
                res.clearCookie('email')
                res.clearCookie('forgotVerificationCode')
                return res.json(user)
            } else if (emailVerficationCode == undefined)
                return res.status(406).json({
                    success: false,
                    message: `Token is expired`,
                })
            else
                return next(
                    createError.BadRequest(`Invalid email verification code`)
                )
        } else {
            return next(createError.NotFound())
        }
    }

    async forgotPassword(req, res, next) {
        const email = req.body.email
        const result = await AuthService.forgotPassword(email)
        if (!result)
            return next(new ResourceNotFoundException(`User`, `email`, email))
        const timeVerificationCode = new Date().getTime()
        const forgotVerificationCode = result
        // Utils.setCookie(res, 'timeVerificationCode', timeVerificationCode)
        Utils.setCookie(
            res,
            'forgotVerificationCode',
            forgotVerificationCode,
            process.env.VERIFICATION_CODE_EXPIRED
        )
        Utils.setCookie(
            res,
            'email',
            email,
            process.env.VERIFICATION_CODE_EXPIRED
        )
        return res.status(200).json({
            message: `Verification code is sent to your email.`,
            code: forgotVerificationCode,
            email: email,
        })
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
