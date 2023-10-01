const Product = require("../models/productModel");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Banner = require("../models/bannerModel");
const Address = require("../models/addressModel");
const { errorMonitor } = require("nodemailer/lib/xoauth2");

//request for home page for users
const getHomePage = asyncHandler(async (req, res) => {
     const brands = await Product.aggregate([
          { $match: { is_delete: false, product_status: true } },
          { $group: { _id: "$brand_name", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $project: { _id: 1 } },
          { $limit: 6 },
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
               $sort: {
                    'products.createdAt': 1
               }
          },
          {
               $group: {
                    _id: '$cat_name',
                    products: { $push: '$products' }
               }
          }
     ]);
     console.log(category[0])
     res.render("user/homePage", {
          brands,
          category,
          banner,
          success: req.flash("success")[0],
          error: req.flash("error")[0],
     });
});
const filterProducts = async (req, res) => {
     let product = await Product.find(req.query);
};


module.exports = {
     getHomePage,
     filterProducts,

};
