const Product = require("../models/productModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Address = require("../models/addressModel");
const Coupon = require("../models/couponModel");
const Category = require("../models/categoryModel");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require('path');

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
            $lookup:{
                from:'payments',
                localField:'_id',
                foreignField:'order_id',
                as:'payment_details',
                pipeline: [
                    {
                        $project:{
                            _id:0,
                            payment_method:1
                        }
                    }
                ]
            }
        },
        {
            $unwind:{
                path:'$payment_details'
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
    console.log(sales[0].payment_details)
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
            $lookup:{
                from:'categories',
                localField:'prod_details.category',
                foreignField:'_id',
                as:'category'
            }
        },
        {
            $unwind:{path:'$category'}
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
        res.render('admin/invoice',{order:orders[0]})
    }else{
        throw new Error()
    }
})



const filterSales=asyncHandler(async(req, res, next)=>{
    let {from_date,to_date,status} = req.body

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
                from:'payments',
                localField:'_id',
                foreignField:'order_id',
                as:'payment_details',
                pipeline: [
                    {
                        $project:{
                            _id:0,
                            payment_method:1
                        }
                    }
                ]
            }
        },
        {
            $unwind:{
                path:'$payment_details'
            }
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

    if(req.body.from_date!=''){
        from_date = new Date(from_date);
        sales=sales.filter((order)=>order.orderDate>=from_date)
    }  
    if(req.body.to_date!=''){
        to_date = new Date(to_date);
        sales=sales.filter((order)=>order.orderDate<=to_date)
    }
    if(req.body.payment_method!=''){
        sales=sales.filter((order)=>order.payment_method==req.body.payment_method)
    }
    if(req.body.from_amt!=''){
        sales=sales.filter((order)=>order.products.price>=parseInt(req.body.from_amt))
    }
    if(req.body.to_amt!=''){
        sales=sales.filter((order)=>order.products.price<=parseInt(req.body.to_amt))
    }

    res.render('admin/salesReport',{sales})

})

module.exports={
    getSalesreport,
    getInvoice,
    filterSales
}