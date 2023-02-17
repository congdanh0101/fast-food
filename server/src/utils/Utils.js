const jwt = require('jsonwebtoken')
require('dotenv').config()
const createError = require('http-errors')

class Utils {
  generateAccessToken = (payload) =>
    jwt.sign(payload, process.env.API_SECRET_KEY, {
      expiresIn: '30s',
      algorithm: 'HS512',
    })
  generateRefreshToken = (payload) =>
    jwt.sign(payload, process.env.API_SECRET_KEY, {
      expiresIn: '365d',
      algorithm: 'HS512',
    })

  verifyToken = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.API_SECRET_KEY, (err, payload) => {
        if (err) return reject(createError.Unauthorized)
        const userID = payload.userID
        resolve(userID)
      })
    })
  }
  //   }
  // }
  // verifyToken(token){
  //   return new Promise((resolve,reject)=>{

  //   })
  // }
}

module.exports = new Utils()
