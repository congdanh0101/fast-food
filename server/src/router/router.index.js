require('dotenv').config()
const authRouter = require('./AuthRouter')
const userRouter = require('./UserRouter')
const categoryRouter = require('./CategoryRouter')
const productRouter = require('./ProductRouter')
const voucherRouter = require('./VoucherRouter')
const orderRouter = require('./OrderRouter')
const paymentRouter = require('./PaymentRouter')
const api = process.env.BASE_API_URL
const express = require('express')
// const app = express()
const errorHandle = require('../middleware/ErrorHandler')

function router(app) {
    app.use(`${api}auth`, authRouter)
    app.use(`${api}user`, userRouter)
    app.use(`${api}category`, categoryRouter)
    app.use(`${api}product`, productRouter)
    app.use(`${api}voucher`, voucherRouter)
    app.use(`${api}order`, orderRouter)
    app.use(`${api}payment`,paymentRouter)
    app.use(errorHandle)
}

// app.use(`${api}auth`, authRouter)
// app.use(errorHandle)

module.exports = router
