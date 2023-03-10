const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const UserService = require('../service/UserService')
const createError = require('http-errors')

class UserController {
    async getUserById(req, res, next) {
        const user = await UserService.getUserById(req.params.id)
        if (!user)
            return next(
                new ResourceNotFoundException(`User`, 'id', req.params.id)
            )
        return res.json(user)
    }

    async getAllUser(req, res, next) {
        const filter = req.query.softDeleted == 1 ? req.query.softDeleted : 0
        const listUser = await UserService.getAllUser(filter)
        if (!listUser) return next(createError(500, 'Something went wrong'))
        return res.json(listUser)
    }

    async updateUser(req, res, next) {
        const data = req.body
        const user = {
            fullName: data.fullName,
            address: data.address,
            email: data.email,
            phoneNumber: data.phoneNumber,
        }
        const updateUser = await UserService.updateUserById(req.params.id, user)
        if (!updateUser)
            return next(
                createError.InternalServerError(
                    `User can not be updated with id: ${req.params.id}`
                )
            )
        return res.json(updateUser)
    }

    async deleteUser(req, res, next) {
        const user = await UserService.deleteUserById(req.params.id)
        if (!user)
            return next(
                new ResourceNotFoundException(`User`, 'id', req.params.id)
            )
        return res.json({
            success: true,
            message: `User with id ${req.params.id} has been deleted`,
        })
    }

    async createUser(req, res, next) {
        const data = req.body
        res.json(await UserService.createUser(data))
    }

    async changePassword(req, res, next) {
        const id = req.params.id
        const data = req.body
        const requestChangePassword = {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
        }
        const result = await UserService.changePassword(
            id,
            requestChangePassword
        )
        if (typeof result === 'string') {
            if (result.includes('current'))
                return next(
                    createError.BadRequest(`Your current password is invalid!`)
                )
            else if (result.includes('confirm'))
                return next(
                    createError.BadRequest(
                        `Your new password and confirm password is not match!`
                    )
                )
            else return next(new ResourceNotFoundException('User', 'id', id))
        }
        return res.json(result)
    }
}

module.exports = new UserController()
