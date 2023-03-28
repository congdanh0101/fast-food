const User = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const uuid = require('uuid')
const EmailService = require('./EmailService')
const UserService = require('./UserService')
const Utils = require('../utils/Utils')
const { default: mongoose } = require('mongoose')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const client = require('../utils/redis.config')
const createHttpError = require('http-errors')

class AuthService {
    async register(user) {
        try {
            //Check email exist
            const existEmail = await User.findOne({ email: user['email'] })
            //Check phone number exist
            const existPhoneNumber = await User.findOne({
                phoneNumber: user['phoneNumber'],
            })
            if (existEmail)
                throw createHttpError.BadRequest(
                    'Email was existed, please try another email!'
                )
            if (existPhoneNumber)
                throw createHttpError.BadRequest(
                    'Phone number was existed, please try another phone number!'
                )

            if (user['confirmPassword'] !== user['password'])
                throw new Error('Password does not match, please try again!')

            const randomCode = Utils.generateVerificationCode()

            await EmailService.sendEmail(
                user['email'],
                'email verfication code'.toUpperCase(),
                EmailService.htmlEmailVerificationCodeRegister(
                    randomCode,
                    user['fullName']
                )
            )

            // user['rewardPoint'] = 0
            // user['rank'] = 'bronze'
            // user['totalOrders'] = 0
            // user['successfulOrder'] = 0
            // user['percentageOfSuccessfulOrder'] = 0
            // user['softDeleted'] = false
            // user['refreshToken'] = null
            delete user.confirmPassword
            // const registerUser = new User(user)
            // const savedUser = await registerUser.save()
            // return savedUser
            return randomCode
            // return await UserService.createUser(user)
        } catch (error) {
            throw error
        }
    }

    async login(request) {
        try {
            const user = await User.findOne({ email: request['username'] })
            if (
                !user ||
                !bcrypt.compareSync(request['password'], user['password'])
            )
                throw new Error(
                    'Invalid username or password, please try again!'
                )
            if (user['softDeleted']) throw new Error('User is restricted')
            const accessToken = Utils.generateAccessToken({
                userID: user['_id'],
            })
            var refreshToken = await Utils.generateRefreshToken({
                userID: user['_id'],
            })
            user['refreshToken'] =
                user['refreshToken'] !== null &&
                user['refreshToken'] !== undefined
                    ? user['refreshToken']
                    : refreshToken
            refreshToken = user['refreshToken']

            await User.findByIdAndUpdate(user['id'], user, { new: true })
            return { accessToken, refreshToken }
        } catch (error) {
            throw error
        }
    }

    async refreshAccessToken(userID) {
        try {
            const user = await UserService.getUserById(userID)
            if (!user) throw new ResourceNotFoundException('User', 'id', userID)
            const accessToken = Utils.generateAccessToken({ userID: userID })
            var refreshToken = await Utils.generateRefreshToken({
                userID: userID,
            })
            user['refreshToken'] = refreshToken
            await User.findByIdAndUpdate(user['id'], user, { new: true })
            return { accessToken, refreshToken }
        } catch (error) {
            throw error
        }
    }

    async logout(userID) {
        try {
            const user = await UserService.getUserById(userID)
            const redisToken = await client.GET(userID.toString())
            // if (!redisToken || !user['refreshToken'])
            //     throw createHttpError.InternalServerError(
            //         'User has been logout'
            //     )
            user['refreshToken'] = null
            await client.DEL(userID.toString(), (err, data) => {
                if (err) {
                    console.log(err)
                    throw createHttpError.InternalServerError()
                }
            })
            return await user.save()
        } catch (error) {
            throw error
        }
    }

    async forgotPassword(email) {
        try {
            const user = await User.findOne({ email: email })
            if (!user)
                throw new ResourceNotFoundException('User', 'email', email)
            const randomCode = Utils.generateVerificationCode()
            await EmailService.sendEmail(
                email,
                `email verfication code`.toUpperCase(),
                EmailService.htmlEmailVerificationCodeForgotPasswor(
                    randomCode,
                    user['fullName']
                )
            )
            return randomCode
        } catch (error) {
            throw error
        }
    }

    async resetPassword(email) {
        const newPassword = Utils.generateRandomResetPassword()
        console.log(newPassword)
        await EmailService.sendEmail(
            email,
            `email verfication code`.toUpperCase(),
            EmailService.htmlResetPassword(newPassword)
        )
        const user = await User.findOne({ email })
        user['password'] = bcrypt.hashSync(newPassword, 10)
        return await user.save()
    }
}

module.exports = new AuthService()
