const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
})

categorySchema.set('toJSON', {
    virtuals: true,
})

module.exports = mongoose.model('Category', categorySchema)
