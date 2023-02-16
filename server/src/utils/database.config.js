require('dotenv').config()
const mongoose = require('mongoose')

async function connectMongoDB() {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: process.env.DB_NAME,
        })
        console.log(`Connect successfully`)
    } catch (error) {
        console.log(`Connect Failure`)
    }
}

module.exports = { connectMongoDB }
