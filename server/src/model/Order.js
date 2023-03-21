const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    totalPrice: {
        type: Number,
        require: true,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
        default: null,
    },
    dateOrder: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        require: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Failed', 'Succeeded'],
        default: 'Pending',
    },
    voucher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher',
        default: null,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                require: true,
            },
            quantity: {
                type: Number,
                require: true,
                min: 1,
            },
        },
    ],
    isPaid: {
        type: Boolean,
        require: true,
        default: false,
    },
    payment: {
        type: String,
        enum: ['Online', 'Cash'],
        require: true,
        default: 'Cash',
    },
    deliveryMethod: {
        type: String,
        enum: ['Ship', 'Pickup'],
        require: true,
        default: 'Ship',
    },
})

module.exports = mongoose.model('Order', orderSchema)
