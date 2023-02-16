const User = require('../model/User')
const bcrypt = require('bcryptjs')
const RoleService = require('./RoleService')
require('dotenv').config()

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
}

module.exports = new UserService()
