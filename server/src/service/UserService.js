const User = require('../model/User')
const bcrypt = require('bcryptjs')
const RoleService = require('./RoleService')
require('dotenv').config()
const mongoose = require('mongoose')
const errorHandler = require('../middleware/ErrorHandler')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const createHttpError = require('http-errors')
const Utils = require('../utils/Utils')

class UserService {
    async createUser(user) {
        try {
            delete user['confirmPassword']
            // user['password'] = bcrypt.hashSync(user['password'], 10)
            user['roles'] = ['USER']
            const savedUser = await new User(user).save()
            if (!savedUser) throw createHttpError.InternalServerError()
            return savedUser
        } catch (error) {
            throw error
        }
    }

    async createAdmin(user) {
        user['password'] = bcrypt.hashSync(user['password'], 10)
        user['roles'] = ['USER', 'ADMIN']
        return await new User(user).save()
    }

    async getUserById(id) {
        try {
            if (!mongoose.isValidObjectId(id))
                throw new ResourceNotFoundException('User', 'id', id)
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
            user['softDeleted'] = true
            // user['refreshToken'] = null
            return await user.save()
        } catch (error) {
            throw error
        }
    }

    async changeSoftDeleted(id) {
        try {
            const user = await this.getUserById(id)
            if (!user)
                throw createHttpError.BadRequest(
                    `User not found with id: ${id}`
                )

            return await User.findByIdAndUpdate(
                id,
                { softDeleted: !user['softDeleted'] },
                { new: true }
            )
        } catch (error) {
            throw error
        }
    }

    async updateUserById(id, data) {
        try {
            //Check phone number exist
            let existPhoneNumber
            if (data['phoneNumber']) {
                existPhoneNumber = await User.findOne({
                    phoneNumber: data['phoneNumber'],
                })
            }

            if (existPhoneNumber) {
                if (existPhoneNumber['_id'].toString() !== id)
                    throw createHttpError.BadRequest(
                        'Phone number was existed, please try another phone number!'
                    )
            }
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

    async getDiscountByRanking(id) {
        try {
            const user = await this.getUserById(id)
            const discount = Utils.getDiscountRanking(user['rank'])
            return discount
        } catch (error) {
            throw error
        }
    }
}

module.exports = new UserService()
