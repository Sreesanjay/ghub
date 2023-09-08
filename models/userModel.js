const mongoose = require('mongoose'); 
var userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    created_at: { 
        type: Date,
        required: true, 
        default: Date.now
     },    
});

//Export the model
module.exports = mongoose.model('User', userSchema);