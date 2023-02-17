const User = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const uuid = require('uuid')
const EmailService = require('./EmailService')
const UserService = require('./UserService')
const Utils = require('../utils/Utils')

class AuthService {
  async register(user) {
    const existEmail = await User.findOne({ email: user['email'] })
    const existPhoneNumber = await User.findOne({
      phoneNumber: user['phoneNumber'],
    })
    if (existEmail) return `email`
    if (existPhoneNumber) return `phone`

    if (user['confirmPassword'] !== user['password']) return `password`

    const randomCode = this.generateVerificationCode()

    // await EmailService.sendEmail(
    //   user['email'],
    //   'email verfication code'.toUpperCase(),
    //   EmailService.htmlEmailVerificationCodeRegister(
    //     randomCode,
    //     user['fullName']
    //   )
    // )

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
    return await UserService.createUser(user)
  }

  generateVerificationCode = () => uuid.v4().split('-')[0].toUpperCase()

  async login(request) {
    const user = await User.findOne({ email: request['username'] })
    if (!user || !bcrypt.compareSync(request['password'], user['password']))
      return null
    if (user['softDeleted']) return `deleted`
    const accessToken = Utils.generateAccessToken({ userID: user['_id'] })
    var refreshToken = Utils.generateRefreshToken({ userID: user['_id'] })
    user['refreshToken'] =
      user['refreshToken'] !== null ? user['refreshToken'] : refreshToken
    refreshToken = user['refreshToken']

    await User.findByIdAndUpdate(user['id'], user, { new: true })
    return { accessToken, refreshToken }
  }

  async refreshToken(userID) {
    const user = await UserService.getUserById(userID)
    if (!user) return null
    const accessToken = Utils.generateAccessToken({ userID: userID })
    var refreshToken = Utils.generateRefreshToken({ userID: userID })
    user['refreshToken'] = refreshToken
    await User.findByIdAndUpdate(user['id'], user, { new: true })
    return { accessToken, refreshToken }
  }
}

module.exports = new AuthService()
