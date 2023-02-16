const errorHandler = (error, req, res, next) => {
    return res.status(error.status || 500).json({
        success: false,
        message: error.message,
        timestamp: new Date().toLocaleString(),
        method: req.method,
        path: req.url,
    })
}

module.exports = errorHandler
