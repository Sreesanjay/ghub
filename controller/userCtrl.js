const Product = require('../models/productModel')
const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler')
const Banner=require('../models/bannerModel');
const { errorMonitor } = require('nodemailer/lib/xoauth2');
const userModel = require('../models/userModel');

//request for home page for users
const getHomePage = asyncHandler(async (req, res) => {
        let brands = await Product.aggregate([
            {$match:{is_delete:false,product_status:true}},
            { $group: { _id: '$brand_name', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { _id: 1 } },
            { $limit: 6 }
        ])
        let banner=await Banner.find({banner_status:true,starting_date:{$lte:new Date()},exp_date:{$gt:new Date()}})
        console.log(banner)
        let category = await Category.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'products',
                    pipeline: [
                        {
                          $match: {
                            is_delete:false,
                            product_status:true
                          }
                        }
                      ]
                }
            },
        ])
        res.render('user/homePage', { brands,category,banner ,success:req.flash('success')[0],error:req.flash('error')[0]})
})
const filterProducts = async (req, res) => {
    console.log(req.query)
    let product = await Product.find(req.query)
}

//get cart
const getCart = asyncHandler(async(req,res,next)=>{
    let user=res.locals.userData._id;
    let cart=res.locals.userData.cart;
    let hai=await User.findById(user).populate('cart.product_id')
    console.log(hai)
    
})

const addToCart=asyncHandler(async(req,res)=>{
    let user=res.locals.userData._id;
    let product=new mongoose.Types.ObjectId(req.params.id);
    let newCart=await User.updateOne({ _id: user, cart:{$not:{ $elemMatch: { product_id: product } } }}, { $push: { cart: { product_id:product } } })
    console.log(newCart)
    if(newCart.modifiedCount!=0){
        console.log('successs')
        res.status(200).json({status:'success'})
    }
    else{
        res.status(200).json({status:'success',exist:true}) 
    }
})


module.exports = {
    getHomePage,
    filterProducts,
    addToCart,
    getCart
}