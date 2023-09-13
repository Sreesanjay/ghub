const mongoose = require('mongoose');
// const Category=require('../models/categoryModel')

var prodSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  brand_name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  prod_price: {
    type: Number,
    required: true,
  },
  sellig_price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  prod_img_1: {
    filename: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
  prod_img_2: [{
    filename: String,
    path:String
}],
  product_status: {
    type: Boolean,
    required: true,
    default: true,
  },
  is_delete: {
    type: Boolean,
    required: true,
    default: false,
  },
  GST: {
    type: Number,
    required: true,
  },
  specification:[{
    spec:String,
    val:String
  }]

}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Product', prodSchema);