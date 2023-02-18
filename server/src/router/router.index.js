require('dotenv').config()
const authRouter = require('./AuthRouter')
const userRouter = require('./UserRouter')
const categoryRouter = require('./CategoryRouter')
const api = process.env.BASE_API_URL
const express = require('express')
// const app = express()
const errorHandle = require('../middleware/ErrorHandler')

function router(app) {
  app.use(`${api}auth`, authRouter)
  app.use(`${api}user`, userRouter)
  app.use(`${api}category`,categoryRouter)
  app.use(errorHandle)
}

// app.use(`${api}auth`, authRouter)
// app.use(errorHandle)

module.exports = router
