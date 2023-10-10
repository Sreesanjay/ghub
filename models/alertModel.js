const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
       },
},
{
    timestamps: true,
})

module.exports = mongoose.model("Alert", alertSchema);
