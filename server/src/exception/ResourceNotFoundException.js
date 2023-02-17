class ResourceNotFoundException extends Error {
  constructor(resourceName, fieldName, fieldValue) {
    super(`${resourceName} not found with ${fieldName}: ${fieldValue}`)
    this.status = 404
  }
}

module.exports = ResourceNotFoundException
