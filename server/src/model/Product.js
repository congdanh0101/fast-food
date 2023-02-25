const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    categories:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    price:{
        type:Number,
        require:true
    }
})