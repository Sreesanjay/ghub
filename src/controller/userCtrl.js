const Product = require("../models/productModel");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Banner = require("../models/bannerModel");
const Order = require("../models/orderModel");
const Address = require("../models/addressModel");
const { errorMonitor } = require("nodemailer/lib/xoauth2");

//request for home page for users
const getHomePage = asyncHandler(async (req, res) => {
     const brands = await Product.aggregate([
          { $match: { is_delete: false, product_status: true } },
          { $group: { _id: "$brand_name", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $project: { _id: 1 } },
          { $limit: 5 },
     ]);
     const banner = await Banner.find({
          banner_status: true,
          starting_date: { $lte: new Date() },
          exp_date: { $gt: new Date() },
     });

     const category = await Category.aggregate([
          {
               $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "category",
                    as: "products",
                    pipeline: [
                         {
                              $match: {
                                   is_delete: false,
                                   product_status: true,
                              },
                         },
                         {
                              $sort: {
                                   'createdAt': -1
                              }
                         },
                         {
                              $limit: 8
                         },
                         {
                              $lookup: {
                                   from: 'reviewrates',
                                   localField: '_id',
                                   foreignField: 'product',
                                   as: 'reviews',
                              }
                         },
                         {
                              $addFields: {
                                   totalRating: { $sum: "$reviews.rating" }
                              }
                         }
                    ],
               },
          },
          {
               $match: {
                    $expr: { $ne: [{ $size: "$products" }, 0] },
               },
          },
          {
               $unwind: {
                    path: '$products'
               }
          },
          {
               $group: {
                    _id: '$cat_name',
                    products: { $push: '$products' }
               }
          },
     ]);
     //adding review and rating to each products in category
     for (let cat of category) {
          for (let prod of cat.products) {
               if (prod.totalRating) {
                    prod.totalRating = prod.totalRating / prod.reviews.length
               }
          }
     }

     const topOrders = await Order.aggregate([
          {
               $unwind: '$products'
          },
          {
               $project: {
                    product: '$products.product'
               }
          },
          {
               $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'products',
                    pipeline: [
                         {
                              $match: {
                                   is_delete: false,
                                   product_status: true,
                              },
                         },
                         {
                              $lookup: {
                                   from: 'reviewrates',
                                   localField: '_id',
                                   foreignField: 'product',
                                   as: 'reviews',
                              }
                         },
                         {
                              $addFields: {
                                   totalRating: { $sum: "$reviews.rating" }
                              }
                         }
                    ]
               }
          },
          {
               $project: {
                    products: 1,
                    _id: 0
               }
          },
          {
               $unwind: {
                    path: '$products'
               }
          },
          {
               $group: {
                    _id: '$products._id',
                    products: { $first: '$products' },
                    count: { $sum: 1 }
               }
          },
          {
               $sort: { count: -1 }
          },
          {
               $limit: 8
          }

     ])

     for (let order of topOrders) {
          if (order.products.totalRating) {
               order.products.totalRating = order.products.totalRating / order.products.reviews.length
          }
     }

     res.render("user/homePage", {
          brands,
          category,
          banner,
          topOrders,
          success: req.flash("success")[0],
          error: req.flash("error")[0],
     });
});



module.exports = {
     getHomePage
};
