const { check } = require('express-validator')

let validateRegisterUser = () => {
  return [
    check('email', `Hãy nhập email`).not().isEmpty(),
    check('email', `Email không hợp lệ`).isEmail(),
    check('dob', `Ngày sinh không hợp lệ`).isISO8601('yyyy-mm-dd'),
    check('fullName', `Hãy nhập họ tên`).not().isEmpty(),
    check('address', `Hãy nhập địa chỉ`).not().isEmpty(),
    check('gender', `Hãy nhập giới tính`).not().isEmpty(),
    check('password', `Hãy nhập mật khẩu`).not().isEmpty(),
    check(
      'password',
      `Mật khẩu phải có ít nhất 6 kí tự`
    ).isLength({ min: 6 }),
    check('phoneNumber', `Xin hãy nhập số điện thoại`).not().isEmpty(),
    check('phoneNumber', `Số điện thoại không bao gồm kí tự đặc biệt`).not().isAlpha(),
    check(
      'phoneNumber',
      `Số điện thoại chỉ từ 10 đến 11 kí tự'`
    ).isLength({ min: 10, max: 11 }),
  ]
}

let validate = {
  validateRegisterUser: validateRegisterUser,
  // validateLogin: validateLogin
}

module.exports = { validate }
