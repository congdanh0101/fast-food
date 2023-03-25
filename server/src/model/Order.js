const mongoose = require('mongoose')
const User = require('./User')
const ResourceNotFoundException = require('../exception/ResourceNotFoundException')
const Utils = require('../utils/Utils')
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
        // default: null,
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
    discount: {
        type: Number,
        default: 0,
    },
    subtotal: {
        type: Number,
        require: true,
        default: 0,
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

// orderSchema.post('findOneAndUpdate', async (data) => {
//     const userID = data['user']
//     try {
//         const user = await User.findById(userID)
//         if (!user) throw new ResourceNotFoundException('User', 'id', userID)
//         user['rank'] = Utils.upgradeRanking(user['rankingPoint'])
//         await user.save()
//         console.log(`User info in post middleware\n ${user}`)
//     } catch (error) {
//         throw error
//     }
// })
module.exports = mongoose.model('Order', orderSchema)
