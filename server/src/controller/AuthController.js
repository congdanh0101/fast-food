const AuthService = require('../service/AuthService')
const createError = require('http-errors')
var { validationResult } = require('express-validator')

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
      phoneNumber: data.phoneNumber,
    }
    const result = await AuthService.register(registerUser)

    if (result === `email`)
      return next(createError.BadRequest('Please try another email!'))
    if (result === `phone`)
      return next(createError.BadRequest('Please try another phone number!'))

    return res.send(result)
  }
}

module.exports = new AuthController()
