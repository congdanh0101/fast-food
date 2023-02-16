const Role = require('../model/Role')

class RoleService {
  async getRoleByName(data) {
    const role = await Role.findOne({ name: data })
    if (!role) return undefined
    return role
  }
  async getRoleById(id) {
    if (await !mongoose.isValidObjectId(id)) return undefined
    const role = await Role.findById(id)
    if (!role) undefined
    return role
  }
}

module.exports = new RoleService()
