class ResourceNotFoundException extends Error {
    constructor(resourceName, fieldName, fieldValue) {
        super(`${resourceName} not found with ${fieldName}: ${fieldValue}`)
        this.status = 400
    }
}

module.exports = ResourceNotFoundException
