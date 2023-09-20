const mongoose = require('mongoose'); 
const bcrypt=require('bcrypt')

var otpSchema = new mongoose.Schema({ 
    email:{
        type:String,
        required:true,
    },   
    otp: {
        type: String,
        required: true,
      },
      createdAt: { 
        type: Date,
        default: Date.now,
        expires: 60,
      },
});

//Export the model
module.exports = mongoose.model('OTP', otpSchema);