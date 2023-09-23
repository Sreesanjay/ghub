const Product = require('../models/productModel')
const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler')
const Banner = require('../models/bannerModel');
const Address = require('../models/addressModel')
const { errorMonitor } = require('nodemailer/lib/xoauth2');

//request for home page for users
const getHomePage = asyncHandler(async (req, res) => {
    let brands = await Product.aggregate([
        { $match: { is_delete: false, product_status: true } },
        { $group: { _id: '$brand_name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 1 } },
        { $limit: 6 }
    ])
    let banner = await Banner.find({ banner_status: true, starting_date: { $lte: new Date() }, exp_date: { $gt: new Date() } })
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
                            is_delete: false,
                            product_status: true
                        }
                    }
                ]
            }
        },
        {
          $match:{
            $expr: { $ne: [{ $size: '$products' }, 0] }
          }
        }
    ])
    res.render('user/homePage', { brands, category, banner, success: req.flash('success')[0], error: req.flash('error')[0] })
})
const filterProducts = async (req, res) => {
    console.log(req.query)
    let product = await Product.find(req.query)
}

//get cart
const getCart = asyncHandler(async (req, res, next) => {
    let user = res.locals.userData._id;
    let cartList = await User.aggregate([
        { $match: { _id: user } },
        { $project: { cart: 1, _id: 0 } },
        { $unwind: { path: '$cart' } },
        {
            $lookup: {
                from: 'products',
                localField: 'cart.product_id',
                foreignField: '_id',
                as: 'prod_detail'
            }
        },
        { $unwind: { path: '$prod_detail' } },
    ])
    for (prod of cartList) {
        prod.price = prod.prod_detail.sellig_price * prod.cart.count
    }
    res.render('user/cart', { cartList })

})

const addToCart = asyncHandler(async (req, res) => {
    let user = res.locals.userData._id;
    let product = new mongoose.Types.ObjectId(req.params.id);
    let newCart = await User.updateOne({ _id: user, cart: { $not: { $elemMatch: { product_id: product } } } }, { $push: { cart: { product_id: product } } })
    console.log(newCart)
    if (newCart.modifiedCount != 0) {
        console.log('successs')
        res.status(200).json({ status: 'success' })
    }
    else {
        res.status(200).json({ status: 'success', exist: true })
    }
})

const decCartCount = asyncHandler(async (req, res) => {
    let user_id = res.locals.userData._id
    let user = await User.findById(user_id)
    if (user) {
        let cart = user.cart.find(item => item.product_id == req.params.id)
        if (cart) {
            if (cart.count != 1) {
                cart.count--;
                await user.save()
            }
            res.status(200).json({ status: 'success' })
        }
        else {
            throw new Error()
        }
    }
})

const addCartCount = asyncHandler(async (req, res) => {
    let user_id = res.locals.userData._id
    let user = await User.findById(user_id)
    if (user) {
        let cart = user.cart.find(item => item.product_id == req.params.id)
        if (cart) {
            let prod = await Product.findById(cart.product_id)
            if (cart.count < prod.stock) {
                let newCart = await User.updateOne(
                    { _id: user, 'cart.product_id': req.params.id },
                    { $inc: { 'cart.$.count': 1 } },
                    { new: true }
                )
                if (newCart) {
                    res.status(200).json({ status: 'success' })
                } else {
                    throw new Error()
                }
            } else {
                const error = new Error('Stock limit exceeded')
                error.statusCode = 400;
                throw error;
            }
        }
    }
    throw new Error()
})

const removeCartItem = asyncHandler(async (req, res, next) => {
    let product_id = new mongoose.Types.ObjectId(req.params.id);
    let user = res.locals.userData._id
    let newCart = await User.updateOne({ _id: user }, { $pull: { cart: { product_id: product_id } } })
    if (newCart) {
        res.status(200).json({ status: 'success' })
    } else {
        throw new Error()
    }
})
const getCheckout=asyncHandler(async (req, res, next) => {
    const user=res.locals.userData._id
    const address= await Address.find({user_id:user})
    let cartList = await User.aggregate([
        { $match: { _id: user } },
        { $project: { cart: 1, _id: 0 } },
        { $unwind: { path: '$cart' } },
        {
            $lookup: {
                from: 'products',
                localField: 'cart.product_id',
                foreignField: '_id',
                as: 'prod_detail'
            }
        },
        { $unwind: { path: '$prod_detail' } },
    ])
    for (prod of cartList) {
        prod.price = prod.prod_detail.sellig_price * prod.cart.count
    }


    res.render('user/checkout',{address})
})


module.exports = {
    getHomePage,
    filterProducts,
    addToCart,
    getCart,
    addCartCount,
    decCartCount,
    removeCartItem,
    getCheckout
}