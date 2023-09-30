const Product = require("../models/productModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Address = require("../models/addressModel");
const Coupon = require("../models/couponModel");
const Category = require("../models/categoryModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");

const getSalesreport=asyncHandler(async(req,res) => {
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
    for(let order of orders){
        if(order.coupon){
            order.coupon.details= await Coupon.findById(order.coupon.coupon_id)
        }
        order.prod_details.category=await Category.findById(order.prod_details.category)
    }
    let sales=orders.filter((order)=>order.products.status==='Delivered') 
    res.render('admin/salesReport',{sales})


})

//get invoice
const getInvoice=asyncHandler(async(req,res)=>{
    console.log(req.query)
    let orders=await Order.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.query.orderid)
            }
        },
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
            $lookup:{
                from:'payments',
                localField:'_id',
                foreignField:'order_id',            
                as:'payment_details'    
            }
        },
        {
            $unwind:{path:'$payment_details'}
        },
        {
            $unwind:{path:'$prod_details'}
        },
        {
            $match:{
                'prod_details._id': new mongoose.Types.ObjectId(req.query.product)
            }
        }
        
    ])
    if(orders){
        for(let order of orders){
            if(order.coupon){
                order.coupon.details= await Coupon.findById(order.coupon.coupon_id)
            }
        }
        const dateObject = new Date(orders[0]);
        orders[0].orderDate=dateObject.toLocaleDateString()

        console.log(orders[0])
        res.render('admin/invoice',{order:orders[0]})
    }else{
        throw new Error()
    }
})

module.exports={
    getSalesreport,
    getInvoice
}