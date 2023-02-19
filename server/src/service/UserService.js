const User = require('../model/User')
const bcrypt = require('bcryptjs')
const RoleService = require('./RoleService')
require('dotenv').config()
const mongoose = require('mongoose')
const errorHandler = require('../middleware/ErrorHandler')

class UserService {
    async createUser(user) {
        // user['rewardPoint'] = 0
        // user['rank'] = 'bronze'
        // user['totalOrders'] = 0
        // user['successfulOrder'] = 0
        // user['percentageOfSuccessfulOrder'] = 0
        // user['softDeleted'] = false
        // user['refreshToken'] = null
        user['password'] = bcrypt.hashSync(user['password'], 10)
        const roleUser = await RoleService.getRoleByName('USER')
        user['roles'] = roleUser
        return await new User(user).save()
    }

    async createAdmin(user) {
        user['password'] = bcrypt.hashSync(user['password'], 10)
        const roleUser = await RoleService.getRoleByName('USER')
        const roleAdmin = await RoleService.getRoleByName('ADMIN')
        var role = [roleUser, roleAdmin]

        user['roles'] = role
        return await new User(user).save()
    }

    async getUserById(id) {
        if (!mongoose.isValidObjectId(id)) return null
        const user = await User.findById(id)
        if (!user) return null
        return user
    }

    async getAllUser(filter) {
        return await User.find({ softDeleted: filter })
    }

    async deleteUserById(id) {
        const user = await this.getUserById(id)
        if (!user) return null
        user['softDeleted'] = true
        user['refreshToken'] = null
        const softDeleted = await User.findByIdAndUpdate(id, user, {
            new: true,
        })
        if (!softDeleted) return null
        return softDeleted
    }

    async updateUserById(id, data) {
        if (!mongoose.isValidObjectId(id)) return null
        var updateUser = await User.findByIdAndUpdate(id, data, { new: true })
        if (!updateUser) return null
        return updateUser
    }
}

module.exports = new UserService()
