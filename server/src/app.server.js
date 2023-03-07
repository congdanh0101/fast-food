require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const router = require('./router/router.index')
const db = require('./utils/database.config')
require('dotenv').config()
const createError = require('http-errors')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')

//HTTP logger
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
    cors({
        credentials: true,
        // allowedHeaders: 'http://localhost:2023',
        origin: 'http://localhost:2023',
        optionsSuccessStatus: 200,
    })
)

app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})

//DB connection
db.connectMongoDB()

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Headers', '*')
//     next()
// })

//App router
// app.use(router)

router(app)
const PORT = process.env.PORT || 2001
app.listen(PORT, () => console.log(`App listening at port ${PORT}`))
