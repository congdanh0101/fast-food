const { check } = require('express-validator')

let validateRegisterUser = () => {
  return [
    check('email', `Invalid email does not empty`).not().isEmpty(),
    check('email', `Invalid email`).isEmail(),
    check('dob', `Invalid birthday`).isISO8601('yyyy-mm-dd'),
    check('fullName', `Invalid fullname does not empty`).not().isEmpty(),
    check('address', `Invalid address does not empty`).not().isEmpty(),
    check('gender', `Invalid gender does not empty`).not().isEmpty(),
    check('password', `Invalid password does not empty`).not().isEmpty(),
    check(
      'password',
      `Invalid password's length at least 6 characters`
    ).isLength({ min: 6 }),
    check('phoneNumber', `Invalid phoneNumber does not empty`).not().isEmpty(),
    check('phoneNumber', `Invalid phoneNumber does not alpha`).not().isAlpha(),
    check(
      'phoneNumber',
      `Invalid phoneNumber's length between 10 and 11 digits'`
    ).isLength({ min: 10, max: 11 }),
  ]
}

let validate = {
  validateRegisterUser: validateRegisterUser,
  // validateLogin: validateLogin
}

module.exports = { validate }
