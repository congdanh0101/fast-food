const createHttpError = require('http-errors')
const jwt = require('jsonwebtoken')
const UserService = require('../service/UserService')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const RoleService = require('../service/RoleService')
require('dotenv').config()

class Authenticate {
    async verifyUSERAuthorization(req, res, next) {
        verifyToken(req, res, async () => {
            const userID = req.user.userID
            const user = await UserService.getUserById(userID)
            if (!user)
                return next(new ResourceNotFoundException(`User`, `id`, userID))
            var rolesID = user['roles']
            const roleList = []
            for (let i = 0; i < rolesID.length; i++) {
                const role = rolesID[i]
                const r = await RoleService.getRoleById(role)
                roleList.push(r['name'])
            }
            if (roleList.includes('USER')) return next()
            return next(createHttpError.Forbidden(`Access denied!`))
        })
    }

    async verifyADMINAuthorization(req, res, next) {
        verifyToken(req, res, async () => {
            const userID = req.user.userID
            const user = await UserService.getUserById(userID)
            if (!user)
                return next(new ResourceNotFoundException(`User`, `id`, userID))
            var rolesID = user['roles']
            const roleList = []
            for (let i = 0; i < rolesID.length; i++) {
                const role = rolesID[i]
                const r = await RoleService.getRoleById(role)
                roleList.push(r['name'])
            }
            if (roleList.includes('ADMIN')) return next()
            return next(createHttpError.Forbidden(`Access denied!`))
        })
    }
}

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const accessToken = authHeader && authHeader.split(' ')[1]
    if (!accessToken) return next(createHttpError.Unauthorized())
    jwt.verify(
        accessToken,
        process.env.API_SECRET_ACCESS_KEY,
        (error, user) => {
            if (error)
                return res.status(403).json({
                    message: 'Access Denied!',
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

// module.exports = verifyToken
