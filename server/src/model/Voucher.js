const mongoose = require('mongoose')
require('dotenv').config()
const Schema = mongoose.Schema
const moment = require('moment')

const voucherSchema = new Schema({
    code: {
        type: String,
        require: true,
        unique: true,
    },
    isActive: {
        type: Boolean,
        require: true,
        default: false,
    },
    expiryDate: {
        type: Date,
        require: true,
        default: moment().add(30, 'days').endOf('day').toDate(),
        // default: new Date().getTime() + process.env.VOUCHER_EXPIRED,
    },
    isExpired: {
        type: Boolean,
        require: true,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    description: [
        {
            type: String,
            default: [],
        },
    ],
    discount: {
        type: Number,
        require: true,
        default: 0,
        min: 0,
        max: 100,
    },
    minOrder: {
        type: Number,
        require: true,
        default:0
    },
    maxDiscount: {
        type: Number,
        require: true,
        default:0
    },
    // conditions: [
    //     {
    //         requirement: [
    //             {
    //                 product: {
    //                     type: mongoose.Schema.Types.ObjectId,
    //                     ref:'Product'
    //                 },
    //                 quantity: {
    //                     type:Number
    //                 },
    //             },
    //         ],
    //         minimumOrderAmount: {
    //             type: Number,
    //             required: true,
    //         },
    //     },
    // ],
})

module.exports = mongoose.model('Voucher', voucherSchema)
