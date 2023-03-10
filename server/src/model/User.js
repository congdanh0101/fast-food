const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema({
    fullName: {
        type: String,
        require: true,
        defaultL: null,
    },
    dob: {
        type: Date,
        require: true,
        defaultL: null,
    },
    gender: {
        type: Boolean,
        require: true,
        defaultL: null,
    },
    // address: [
    //     {
    //         type: Map,
    //         require: true,
    //         defaultL: [],
    //     },
    // ],
    address: [
        {
            type: String,
            require: true,
            defaultL: [],
        },
    ],
    phoneNumber: {
        type: Number,
        require: true,
        unique: true,
    },
    rewardPoint: {
        type: Number,
        default: 0,
    },
    rank: {
        type: String,
        default: 'Bronze',
    },
    totalOrders: {
        type: Number,
        default: 0,
    },
    successfulOrder: {
        type: Number,
        default: 0,
    },
    percentageOfSuccessfulOrder: {
        type: Number,
        default: 0,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
        },
    ],
    softDeleted: {
        type: Boolean,
        require: true,
        default: false,
    },
    refreshToken: {
        type: String,
        default: null,
    },
})

userSchema.set('toJSON', {
    virtuals: true,
})

module.exports = mongoose.model('User', userSchema)
