const Role = require('../model/Role')
const mongoose = require('mongoose')

class RoleService {
  async getRoleByName(data) {
    const role = await Role.findOne({ name: data })
    if (!role) return null
    return role
  }
  async getRoleById(id) {
    if (await !mongoose.isValidObjectId(id)) return null
    const role = await Role.findById(id)
    if (!role) null
    return role
  }
}

module.exports = new RoleService()
