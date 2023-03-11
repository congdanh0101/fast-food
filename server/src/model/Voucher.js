const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    expired: {
        type: Date,
        default: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
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
        },
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:null
    },
    discount: {
        type: Number,
        require: true,
        default: 0,
    },
    minDiscount: {
        type: Number,
    },
    maxDiscount: {
        type: Number,
    },
    type:{
        type:String,
        default:'Percentage'
    }
})


voucherSchema.set('toJSON', {
    virtuals: true,
})

module.exports = mongoose.model('Voucher', voucherSchema)
