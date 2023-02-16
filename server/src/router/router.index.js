require('dotenv').config()
const authRouter = require('./auth')
const api = process.env.BASE_API_URL
const express = require('express')
// const app = express()
const errorHandle = require('../middleware/ErrorHandler')

function router(app) {
    app.use(`${api}auth`, authRouter)
    app.use(errorHandle)
}

// app.use(`${api}auth`, authRouter)
// app.use(errorHandle)

module.exports = router
