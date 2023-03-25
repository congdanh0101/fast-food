const User = require('../model/User')
const bcrypt = require('bcryptjs')
const RoleService = require('./RoleService')
require('dotenv').config()
const mongoose = require('mongoose')
const errorHandler = require('../middleware/ErrorHandler')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const createHttpError = require('http-errors')

class UserService {
    async createUser(user) {
        console.log(user)
        // user['rewardPoint'] = 0
        // user['rank'] = 'bronze'
        // user['totalOrders'] = 0
        // user['successfulOrder'] = 0
        // user['percentageOfSuccessfulOrder'] = 0
        // user['softDeleted'] = false
        // user['refreshToken'] = null
        delete user['confirmPassword']
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
        // if (!mongoose.isValidObjectId(id)) return null
        // const user = await User.findById(id)
        // if (!user) return null
        // return user

        try {
            const user = await User.findById(id)
            if (!user) throw new ResourceNotFoundException('User', 'id', id)
            return user
        } catch (error) {
            throw error
        }
    }

    async getAllUser(filter = {}) {
        try {
            const listUser = await User.find(filter)
            return listUser
        } catch (error) {
            throw error
        }
    }

    async deleteUserById(id) {
        try {
            const user = await this.getUserById(id)
            if (!user) throw new ResourceNotFoundException('User', 'id', id)
            user['softDeleted'] = true
            user['refreshToken'] = null
            const softDeleted = await User.findByIdAndUpdate(id, user, {
                new: true,
            })
            if (!softDeleted) throw new createHttpError.InternalServerError()
            return softDeleted
        } catch (error) {
            throw error
        }
    }

    async updateUserById(id, data) {
        try {
            const user = await User.findByIdAndUpdate(id, data, { new: true })
            if (!user) throw new Error(`User cannot be updated with id: ${id}`)
            return user
        } catch (error) {
            throw error
        }
    }

    async changePassword(id, data) {
        try {
            const user = await this.getUserById(id)
            if (!user) throw new ResourceNotFoundException('User', 'id', id)
            if (!bcrypt.compareSync(data['currentPassword'], user['password']))
                throw new Error('Your password is invalid, please try again!')
            if (data['newPassword'] !== data['confirmPassword'])
                throw new Error('Your password is invalid, please try again!')
            user['password'] = bcrypt.hashSync(data['newPassword'], 10)
            const updatedUser = await User.findByIdAndUpdate(id, user, {
                new: true,
            })
            if (!updatedUser) throw new Error('User cannot change password')
            return updatedUser
        } catch (error) {
            throw error
        }
    }
}

module.exports = new UserService()
