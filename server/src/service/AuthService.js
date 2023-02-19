const User = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const uuid = require('uuid')
const EmailService = require('./EmailService')
const UserService = require('./UserService')
const Utils = require('../utils/Utils')
const { default: mongoose } = require('mongoose')

class AuthService {
    async register(user) {
        //Check email exist
        const existEmail = await User.findOne({ email: user['email'] })
        //Check phone number exist
        const existPhoneNumber = await User.findOne({
            phoneNumber: user['phoneNumber'],
        })
        if (existEmail) return `email`
        if (existPhoneNumber) return `phone`

        if (user['confirmPassword'] !== user['password']) return `password`

        const randomCode = Utils.generateVerificationCode()

        await EmailService.sendEmail(
            user['email'],
            'email verfication code'.toUpperCase(),
            EmailService.htmlEmailVerificationCodeRegister(
                randomCode,
                user['fullName']
            )
        )

        user['rewardPoint'] = 0
        user['rank'] = 'bronze'
        user['totalOrders'] = 0
        user['successfulOrder'] = 0
        user['percentageOfSuccessfulOrder'] = 0
        user['softDeleted'] = false
        user['refreshToken'] = null
        delete user.confirmPassword
        // const registerUser = new User(user)
        // const savedUser = await registerUser.save()
        // return savedUser
        return randomCode
        // return await UserService.createUser(user)
    }

    async login(request) {
        const user = await User.findOne({ email: request['username'] })
        if (!user || !bcrypt.compareSync(request['password'], user['password']))
            return null
        if (user['softDeleted']) return `deleted`
        const accessToken = Utils.generateAccessToken({ userID: user['_id'] })
        var refreshToken = Utils.generateRefreshToken({ userID: user['_id'] })
        user['refreshToken'] =
            (user['refreshToken'] !== null && user['refreshToken']!==undefined) ? user['refreshToken'] : refreshToken
        refreshToken = user['refreshToken']

        await User.findByIdAndUpdate(user['id'], user, { new: true })
        return { accessToken, refreshToken }
    }

    async refreshAccessToken(userID) {
        const user = await UserService.getUserById(userID)
        if (!user) return null
        const accessToken = Utils.generateAccessToken({ userID: userID })
        var refreshToken = Utils.generateRefreshToken({ userID: userID })
        user['refreshToken'] = refreshToken
        await User.findByIdAndUpdate(user['id'], user, { new: true })
        return { accessToken, refreshToken }
    }

    async logout(userID) {
        if (!mongoose.isValidObjectId(userID)) return null
        return await User.findByIdAndUpdate(
            userID,
            { refreshToken: null },
            { new: true }
        )
    }

    async forgotPassword(email) {
        const user = await User.findOne({ email: email })
        if (!user) return null
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
