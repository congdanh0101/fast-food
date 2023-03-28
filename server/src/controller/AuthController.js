const AuthService = require('../service/AuthService')
const createError = require('http-errors')
var { validationResult } = require('express-validator')
const Utils = require('../utils/Utils')
const jwt = require('jsonwebtoken')
const UserService = require('../service/UserService')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const client = require('../utils/redis.config')

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
        try {
            const result = await AuthService.register(registerUser)
            const registerVerificationCode = result
            Utils.setCookie(
                res,
                'registerVerificationCode',
                registerVerificationCode,
                process.env.VERIFICATION_CODE_EXPIRED
            )
            console.log(registerUser)
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
                expired:
                    new Date().getTime() +
                    process.env.VERIFICATION_CODE_EXPIRED * 1000,
            })
        } catch (error) {
            return next(error)
        }
    }

    async login(req, res, next) {
        const data = req.body
        const loginRequest = {
            username: data.username,
            password: data.password,
        }
        try {
            const token = await AuthService.login(loginRequest)
            //cookie configuration for refresh token
            Utils.setCookie(res, 'refreshToken', token['refreshToken'])
            return res.json({ accessToken: token['accessToken'] })
        } catch (error) {
            return next(error)
        }
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
            const user = await UserService.getUserById(userID)
            if (
                (await client.GET(userID)) === refreshToken ||
                user['refreshToken'] === refreshToken
            ) {
                //generate new access token + refresh token
                const newToken = await AuthService.refreshAccessToken(userID)
                //cookie configuration for refresh token
                Utils.setCookie(res, 'refreshToken', newToken['refreshToken'])
                return res.json({ accessToken: newToken['accessToken'] })
            } else return next(createError.InternalServerError())
        } catch (error) {
            return next(error)
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
        try {
            await AuthService.logout(userID)
            //clear refresh token in cookie and database
            res.clearCookie('refreshToken')
            return res.json({ message: `Logout successfully` })
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = new AuthController()
