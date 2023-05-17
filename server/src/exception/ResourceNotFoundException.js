class ResourceNotFoundException extends Error {
  constructor(resourceName, fieldName, fieldValue) {
    super(`${resourceName} không tìm thấy với ${fieldName}: ${fieldValue}`)
    this.status = 404
  }
}

module.exports = ResourceNotFoundException
