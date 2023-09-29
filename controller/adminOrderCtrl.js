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
    for(let order of orders){
        if(order.coupon){
            order.coupon.details= await Coupon.findById(order.coupon.coupon_id)
        }
    }
    console.log(orders[10])
    res.render('admin/orderList',{orders})
});
//filter order
const filterOrder=asyncHandler(async(req,res)=>{
    let {from_date,to_date} = req.body
    // from_date = new Date(from_date);
    // from_date = from_date.toISOString();
    // to_date = new Date(to_date);
    // to_date = to_date.toISOString();
    // console.log(from_date,":",to_date)
    let orders=await Order.aggregate([
        // {
        //     $match:{
        //         order_date: {
        //             $gte: req.body.from_date,
        //             $lt: req.body.to_date
        //           }
        //     }
        // },
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
    }
    console.log(orders[10])
    res.render('admin/orderList',{orders})
})

//get details of a single order
const ViewOrderDetails=asyncHandler(async(req,res,next)=>{
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
            $unwind:{path:'$prod_details'}
        },
        {
            $match:{
                'prod_details._id': new mongoose.Types.ObjectId(req.query.product)
            }
        }
        
    ])
    console.log(orders)
    if(orders){
        for(let order of orders){
            if(order.coupon){
                order.coupon.details= await Coupon.findById(order.coupon.coupon_id)
            }
        }
        const dateObject = new Date(orders[0].orderDate);
        orders[0].orderDate=dateObject.toLocaleDateString()
        console.log(orders[0].products)
        res.render('admin/ViewOrder',{order:orders[0]})
    }else{
        throw new Error()
    }
})

const changeStatus=asyncHandler(async(req,res)=>{
    let order=await Order.findById(req.body.order_id)
    let product = order.products.find((item) => item.product == req.body.product_id);
    product.status=req.body.status
    if(req.body.status=='Confirmed'){
        product.confirmed_date = new Date()
    }
    else if(req.body.status=='Shipped'){
        product.shipped_date = new Date()
    }else if(req.body.status=='Out for delivery'){
        product.out_for_delivery_date = new Date()
    }else if(req.body.status=='Delivered'){
        product.delivered_date = new Date()
    }else if(req.body.status=='Canceled'){
        product.cancelled_date=new Date()
    }
    const savedOrder = await order.save()
    if(savedOrder){
        res.status(200).json({status:'success'})    
    }else{
        throw new Error()
    }
})


module.exports={
getAllOrders,
ViewOrderDetails,
changeStatus,
filterOrder
}