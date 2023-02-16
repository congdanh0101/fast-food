require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const router = require('./router/router.index')
const db = require('./utils/database.config')
const app = express()

//HTTP logger
app.use(morgan('dev'))
app.use(express.json())

//DB connection
db.connectMongoDB()

//App router
router(app)



app.listen(2001, () => console.log(`App listening at port 2001`))
