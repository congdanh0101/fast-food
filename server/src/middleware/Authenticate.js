const createHttpError = require('http-errors')
const jwt = require('jsonwebtoken')
const UserService = require('../service/UserService')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const RoleService = require('../service/RoleService')
require('dotenv').config()

class Authenticate {
    async AuthorizationUSER(req, res, next) {
        verifyAccessToken(req, res, async () => {
            try {
                const userID = req.user.userID
                const user = await UserService.getUserById(userID)
                req.userID = userID
                const role = user['roles']
                console.log(`Role ${role}`)
                if (role.includes('USER')) return next()
                return next(createHttpError.Forbidden(`Từ chối truy cập!`))
            } catch (error) {
                return next(error)
            }
        })
    }

    async AuthorizationADMIN(req, res, next) {
        verifyAccessToken(req, res, async () => {
            try {
                const userID = req.user.userID
                const user = await UserService.getUserById(userID)
                const role = user['roles']
                if (role.includes('ADMIN')) return next()
                return next(createHttpError.Forbidden(`Từ chối truy cập!`))
            } catch (error) {
                return next(error)
            }
        })
    }
}

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const accessToken = authHeader && authHeader.split(' ')[1]
    if (!accessToken)
        return res.status(401).send(createHttpError.Unauthorized())
    jwt.verify(
        accessToken,
        process.env.API_SECRET_ACCESS_KEY,
        (error, user) => {
            if (error)
                return res.status(403).json({
                    message: 'Từ chối truy cập!',
                    error: error,
                    success: false,
                })
            req.user = user
            console.log(user)
            return next()
        }
    )
}

module.exports = new Authenticate()

// module.exports = verifyAccessToken
