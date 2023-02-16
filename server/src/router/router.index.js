require('dotenv').config()
const authRouter = require('./auth')
const api = process.env.BASE_API_URL


function router(app) {
    app.use(`${api}auth`, authRouter)
}

module.exports = router
