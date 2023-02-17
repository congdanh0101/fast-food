const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const UserService = require('../service/UserService')
const createError = require('http-errors')

class UserController {
  async getUserById(req, res, next) {
    const user = await UserService.getUserById(req.params.id)
    if (!user)
      return next(new ResourceNotFoundException(`User`, 'id', req.params.id))
    return res.json(user)
  }

  async getAllUser(req, res, next) {
    const listUser = await UserService.getAllUser()
    if (!listUser) return next(createError(500, 'Something went wrong'))
    return res.json(listUser)
  }

  async updateUser(req, res, next) {}

  async deleteUser(req, res, next) {
    const user = await UserService.deleteUserById(req.params.id)
    if (!user)
      return next(new ResourceNotFoundException(`User`, 'id', req.params.id))
    return res.json({
      success: true,
      message: `User with id ${req.params.id} has been deleted`,
    })
  }
}

module.exports = new UserController()
