const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler')


//request for home page for users
const getHomePage = asyncHandler(async (req, res) => {
        let brands = await Product.aggregate([
            {$match:{is_delete:false,product_status:true}},
            { $group: { _id: '$brand_name', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { _id: 1 } },
            { $limit: 6 }
        ])
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
        res.render('user/homePage', { brands,category ,success:req.flash('success')[0],error:req.flash('error')[0]})
})
const filterProducts = async (req, res) => {
    console.log(req.query)
    let product = await Product.find(req.query)
}


module.exports = {
    getHomePage,
    filterProducts,
}