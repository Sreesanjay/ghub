const Product = require("../models/productModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Address = require("../models/addressModel");
const Coupon = require("../models/couponModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const Razorpay = require("razorpay");

//get all orders
const getAllOrders=asyncHandler(async(req,res,next)=>{
    let orders=await Order.aggregate([
        {
            $lookup:{
                from:'users',
                localField:'user',
                foreignField:'_id',
                as:'user'
            }
        },
        {
            $unwind:{
                path:'$user'
            }
        },
        {
            $unwind:{path:'$products'}
        },
        {
            $lookup:{
                from:'products',
                localField:'products.product',
                foreignField:'_id',
                as:'prod_details'
            }
        },
        {
            $unwind:{path:'$prod_details'}
        },
    ])
    orders.forEach(async(order)=>{
        if(order.coupon){
            order.coupon.details= await Coupon.findById(order.coupon.coupon_id)
        }
    })
    console.log(orders[10])
});





module.exports={
getAllOrders
}