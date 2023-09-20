const mongoose = require('mongoose');

var addressSchema = new mongoose.Schema({
    user_name:{
        type: String,
        required: true,
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    phone:{
        type:String,
        required: true
    },
    pincode:{
        type:Number,
        required:true
    },
    locality:{
        type:String,
        required: true
    },
    area_street:{
        type:String,
        required: true
    },
    town:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required: true
    },
    alternate_phone:{
        type:String,
    },
    landmark:{
        type:String
    }
}, {
    timestamps: true
})


//Export the model
module.exports = mongoose.model('Address', addressSchema);