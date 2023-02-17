const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema({
  fullName: {
    type: String,
    require: true,
  },
  dob: {
    type: Date,
    require: true,
  },
  gender: {
    type: Boolean,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: Number,
    require: true,
    unique: true,
  },
  rewardPoint: {
    type: Number,
  },
  rank: {
    type: String,
  },
  totalOrders: {
    type: Number,
  },
  successfulOrder: {
    type: Number,
  },
  percentageOfSuccessfulOrder: {
    type: Number,
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
  },
})

userSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

userSchema.set('toJSON', {
  virtuals: true,
})

module.exports = mongoose.model('User', userSchema)
