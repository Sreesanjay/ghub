const mongoose = require('mongoose'); 
var catSchema = new mongoose.Schema({ 
    cat_name:{
        type:String,
        required:true,
    },   
    cat_status: {
        type: Boolean,
        required: true,
        default:true,
      },
      discription: { 
        type: String,
        required: true,
      },
      is_delete: { 
        type: Boolean,
        required: true,
        default:false,
      },
},{timestamps: true });

//Export the model
module.exports = mongoose.model('Category', catSchema);