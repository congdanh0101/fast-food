const AuthService = require('../service/AuthService')
const createError = require('http-errors')
var { validationResult } = require('express-validator')
const Utils = require('../utils/Utils')

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
      return next(createError.BadRequest('Please try another phone number!'))
    if (result === `password`)
      return next(
        createError.BadRequest('Password does not match, please try again!')
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
      return next(createError.InternalServerError(`User had been deleted`))
    return res.json(token)
  }

  async refreshToken(req, res, next) {
    try {
      const token = req.body.refreshToken
      if (!token) return next(createError.BadRequest())
      const userID = await Utils.verifyToken(token)

      const newToken = await AuthService.refreshToken(userID)
      return res.json(newToken)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AuthController()
