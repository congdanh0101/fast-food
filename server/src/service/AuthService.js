const User = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()


const uuid = require('uuid')
const EmailService = require('./EmailService')
const UserService = require('./UserService')

class AuthService {
  async register(user) {
    const existEmail = await User.findOne({ email: user['email'] })
    const existPhoneNumber = await User.findOne({
      phoneNumber: user['phoneNumber'],
    })
    if (existEmail) return `email`
    if (existPhoneNumber) return `phone`

    const randomCode = this.generateVerificationCode()
    console.log(randomCode)

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

    // const registerUser = new User(user)
    // const savedUser = await registerUser.save()
    // return savedUser
    return await UserService.createUser(user)
  }

  generateVerificationCode = () => uuid.v4().split('-')[0].toUpperCase()
}

module.exports = new AuthService()
