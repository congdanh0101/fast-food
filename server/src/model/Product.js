const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    price: {
        type: Number,
        require: true,
        default: 0,
    },
    view: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Array,
        default: [],
    },
    img: [
        {
            type: String,
            default: null,
            require: true,
        },
    ],
    softDeleted: {
        type: Boolean,
        default: false,
    },
    combo: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                require: true,
                min: 1,
            },
        },
    ],
    description: {
        type: String,
    },
})

// productSchema.set('toJSON', {
//     virtuals: true,
// })

module.exports = mongoose.model('Product', productSchema)
