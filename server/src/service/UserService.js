const User = require('../model/User')
const bcrypt = require('bcryptjs')
const RoleService = require('./RoleService')
require('dotenv').config()
const mongoose = require('mongoose')
const errorHandler = require('../middleware/ErrorHandler')

class UserService {
  async createUser(user) {
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

  async getAllUser() {
    return await User.find()
  }

  async deleteUserById(id) {
    // if (!mongoose.isValidObjectId(id)) return null
    // const deleteUser = await User.findByIdAndRemove(id)
    // if (!deleteUser) return null
    // return deleteUser
    const user = await this.getUserById(id)
    if (!user) return null
    user['softDeleted'] = true
    const softDeleted = await User.findByIdAndUpdate(id, user, { new: true })
    if (!softDeleted) return null
    return softDeleted
  }
}

module.exports = new UserService()
