const Admin = require('../models/adminModel')
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");


const getDashboard = asyncHandler(async (req, res) => {
    let orders = await Order.aggregate([
        {
            $unwind: {
                path: '$products'
            }
        },
        {
            $match: {
                'products.status': 'Delivered'
            }
        },
    ])
    let totalSales=orders.reduce((acc,order)=>{
        let price;
        if (order.products.discount) {
            price = order.products.price - order.products.discount
        } else {
            price = order.products.price
        }
        console.log(price)
        return acc+price;
    },0)

    //user count
    const userCount=await User.countDocuments({})
    //product count
    const prodCount=await Product.countDocuments({is_delete:false})
    res.render('admin/dashboard',{totalSales,userCount,prodCount})
})

const getRevenue=asyncHandler(async(req,res)=>{
    let orders = await Order.aggregate([
        {
            $unwind: {
                path: '$products'
            }
        },
        {
            $match: {
                'products.status': 'Delivered'
            }
        },
    ])
    let year;
    let revenue = [0,0,0,0,0,0,0,0,0,0,0,0]
    if (req.query.year) {
        year = req.query.year;
    } else {
        year = new Date().getFullYear()
    }
    orders = orders.filter((order) => {
        if (new Date(order.products.delivered_date).getFullYear() == year) {
            return true
        }
    })

    for (let order of orders) {
        let deleveryMonth = new Date(order.products.delivered_date).getMonth() + 1
        let price;
        if (order.products.discount) {
            price = order.products.price - order.products.discount
        } else {
            price = order.products.price
        }
        switch (deleveryMonth) {
            case 1:
                revenue[0] = revenue[0] + price;
                break;
            case 2:
                revenue[1] = revenue[1] + price;
                break;
            case 3:
                revenue[2]= revenue[2]+ price;
                break;
            case 4:
                revenue[3] = revenue[3] + price;
                break;
            case 5:
                revenue[4] = revenue[4] + price;
                break;
            case 6:
                revenue[5]= revenue[5] + price;
                break;
            case 7:
                revenue[6]= revenue[6] + price;
                break;
            case 8:
                revenue[7] = revenue[7] + price;
                break;
            case 9:
                revenue[8] = revenue[8] + price;
                break;

            case 10:
                revenue[9] = revenue[9] + price;
                break;
            case 11:
                revenue[10] = revenue[10] + price;
                break;
            case 12:
                revenue[11] = revenue[11] + price;
                break;
        }
    }

    res.status(200).json(revenue)
})
module.exports = {
    getDashboard,
    getRevenue
}