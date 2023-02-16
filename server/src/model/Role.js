const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    name:{
        type : String,
        required: true,
    }
})

roleSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

roleSchema.set('toJSON', {
    virtuals: true,
});


module.exports = mongoose.model('Role', roleSchema);