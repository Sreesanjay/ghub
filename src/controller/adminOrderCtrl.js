const Product = require("../models/productModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Address = require("../models/addressModel");
const Coupon = require("../models/couponModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const Razorpay = require("razorpay");
const Alert = require("../models/alertModel");

//get all orders
const getAllOrders = asyncHandler(async (req, res, next) => {
    let orders = await Order.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: {
                path: '$user'
            }
        },
        {
            $unwind: { path: '$products' }
        },
        {
            $lookup: {
                from: 'payments',
                localField: '_id',
                foreignField: 'order_id',
                as: 'payment_details',
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            payment_method: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: '$payment_details'
            }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'products.product',
                foreignField: '_id',
                as: 'prod_details'
            }
        },
        {
            $unwind: { path: '$prod_details' }
        },
    ])
    for (let order of orders) {
        if (order.coupon) {
            order.coupon.details = await Coupon.findById(order.coupon.coupon_id)
        }
    }
    res.render('admin/orderList', { orders })
});
//filter order
const filterOrder = asyncHandler(async (req, res) => {
    let { from_date, to_date, status } = req.body

    let orders = await Order.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: {
                path: '$user'
            }
        },
        {
            $lookup: {
                from: 'payments',
                localField: '_id',
                foreignField: 'order_id',
                as: 'payment_details',
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            payment_method: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: '$payment_details'
            }
        },
        {
            $unwind: { path: '$products' }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'products.product',
                foreignField: '_id',
                as: 'prod_details'
            }
        },
        {
            $unwind: { path: '$prod_details' }
        },
    ])
    for (let order of orders) {
        if (order.coupon) {
            order.coupon.details = await Coupon.findById(order.coupon.coupon_id)
        }
    }

    if (req.body.from_date != '') {
        from_date = new Date(from_date);
        orders = orders.filter((order) => order.orderDate >= from_date)
    }
    if (to_date == undefined) {
        return res.render('admin/orderList', { orders })
    }
    if (req.body.to_date != '') {
        to_date = new Date(to_date);
        orders = orders.filter((order) => order.orderDate <= to_date)
    }
    if (req.body.status != '') {
        orders = orders.filter((order) => order.products.status == status)
    }
    if (req.body.payment_method != '') {
        orders = orders.filter((order) => order.payment_method == req.body.payment_method)
    }
    if (req.body.from_amt != '') {
        orders = orders.filter((order) => order.products.price >= parseInt(req.body.from_amt))
    }
    if (req.body.to_amt != '') {
        orders = orders.filter((order) => order.products.price <= parseInt(req.body.to_amt))
    }

    res.render('admin/orderList', { orders })

})

//get details of a single order
const ViewOrderDetails = asyncHandler(async (req, res, next) => {
    console.log(req.query)
    let orders = await Order.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.query.orderid)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: {
                path: '$user'
            }
        },
        {
            $unwind: { path: '$products' }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'products.product',
                foreignField: '_id',
                as: 'prod_details'
            }
        },
        {
            $lookup: {
                from: 'payments',
                localField: '_id',
                foreignField: 'order_id',
                as: 'payment_details'
            }
        },
        {
            $unwind: { path: '$prod_details' }
        },
        {
            $match: {
                'prod_details._id': new mongoose.Types.ObjectId(req.query.product)
            }
        }

    ])
    console.log(orders.length)
    if (orders) {
        for (let order of orders) {
            if (order.coupon) {
                order.coupon.details = await Coupon.findById(order.coupon.coupon_id)
            }
        }
        const dateObject = new Date(orders[0].orderDate);
        orders[0].orderDate = dateObject.toLocaleDateString()
        console.log(orders[0].products)
        res.render('admin/ViewOrder', { order: orders[0] })
    } else {
        throw new Error()
    }
})

const changeStatus = asyncHandler(async (req, res) => {
    let order = await Order.findById(req.body.order_id)
    let product = order.products.find((item) => item.product == req.body.product_id);
    if (product.status == 'Return pending' && req.body.status == 'Delivered') {
        await Order.updateOne(
            {
              _id: req.body.order_id,
              'products.product': new mongoose.Types.ObjectId(req.body.product_id)
            },
            {
              $unset: { 'products.$.return_pending_date': '' }
            }
          );
        product.status = req.body.status
        const savedOrder = await order.save()
        if (savedOrder) {
            const alert = `Your return request rejected on ` + new Date().getFullYear() + "-" + new Date().getMonth() + "-" + new Date().getDay();
            await Alert.create({
                message: alert,
                user: savedOrder.user
            })
            res.status(200).json({ status: 'success' })
        } else {
            throw new Error()
        }
    } else {
        product.status = req.body.status
        if (req.body.status == 'Confirmed') {
            product.confirmed_date = new Date()
        }
        else if (req.body.status == 'Shipped') {
            product.shipped_date = new Date()
        } else if (req.body.status == 'Out for delivery') {
            product.out_for_delivery_date = new Date()
        } else if (req.body.status == 'Delivered') {
            product.delivered_date = new Date()
            if (order.payment_method == 'COD') {

                let payment = await Payment.findOne({ order_id: order._id })
                payment.status = 'success';
                await payment.save();
            }

        } else if (req.body.status == 'Canceled') {
            product.cancelled_date = new Date()
            if (order.payment_method === 'ONLINE' || order.payment_method === 'GHUBWALLET') {
                let user = await User.findById(order.user)
                if (user) {
                    if (product.discount) {
                        user.user_wallet = user.user_wallet + (product.price - product.discount)
                    } else {
                        user.user_wallet = user.user_wallet + product.price
                    }
                    await user.save()
                }
            }
        } else if (req.body.status == 'Returned') {
            product.returned_date = new Date()
            if (order.payment_method === 'ONLINE' || order.payment_method === 'GHUBWALLET') {
                let user = await User.findById(order.user)
                if (user) {
                    if (product.discount) {
                        user.user_wallet = user.user_wallet + (product.price - product.discount)
                    } else {
                        user.user_wallet = user.user_wallet + product.price
                    }
                    await user.save()
                }
            }
        }
        const savedOrder = await order.save()
        if (savedOrder) {
            const alert = `Your order has been ${req.body.status} on ` + new Date().getFullYear() + "-" + new Date().getMonth() + "-" + new Date().getDay();
            await Alert.create({
                message: alert,
                user: savedOrder.user
            })
            res.status(200).json({ status: 'success' })
        } else {
            throw new Error()
        }
    }
})


module.exports = {
    getAllOrders,
    ViewOrderDetails,
    changeStatus,
    filterOrder
}