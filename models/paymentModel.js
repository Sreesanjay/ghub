const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    payment_id:{
        type:String,
        required:true,
    },
    amount:{
        type:String,
        required:true,
    },
    currency:{
        type:String,
        required:true,
    },
    receipt:{
        type:String,
        required:true,
    },
    created_at:{
        type:Date,
        required:true,
    },


});
module.exports = mongoose.model("Payment", paymentSchema);

