const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const ReviewRate = require("../models/reviewRatingModel");
const Banner = require("../models/bannerModel");



// function similarity(s1, s2) {
//      let longer = s1;
//      let shorter = s2;
//      if (s1.length < s2.length) {
//           longer = s2;
//           shorter = s1;
//      }
//      let longerLength = longer.length;
//      if (longerLength === 0) {
//           return 1.0;
//      }
//      return (
//           (longerLength - editDistance(longer, shorter)) /
//           parseFloat(longerLength)
//      );
// }

// function editDistance(s1, s2) {
//      s1 = s1.toLowerCase();
//      s2 = s2.toLowerCase();
//      s1 = s1.replace(/\s/g, "")
//      s2 = s2.replace(/\s/g, "")



//      let costs = new Array();
//      for (let i = 0; i <= s1.length; i++) {
//           let lastValue = i;
//           for (let j = 0; j <= s2.length; j++) {
//                if (i == 0) costs[j] = j;
//                else {
//                     if (j > 0) {
//                          let newValue = costs[j - 1];
//                          if (s1.charAt(i - 1) != s2.charAt(j - 1))
//                               newValue =
//                                    Math.min(
//                                         Math.min(newValue, lastValue),
//                                         costs[j]
//                                    ) + 1;
//                          costs[j - 1] = lastValue;
//                          lastValue = newValue;
//                     }
//                }
//           }
//           if (i > 0) costs[s2.length] = lastValue;
//      }
//      return costs[s2.length];
// }


const viewProduct = async (req, res, next) => {
     try {
          const product = await Product.findById(req.params.id);
          const category = await Category.find();
          const rel_product = await Product.find({
               category: product.category,
               _id: { $nin: [product._id] },
               is_delete: false,
               product_status: true,
          }).limit(10);
          if (product.product_status == false || product.is_delete == true) {
               req.flash('error', 'Product cannot find!')
               res.redirect('/')
          }
          const reviews = await ReviewRate.aggregate([
               {
                    $match: { product: product._id }
               },
               {
                    $lookup: {
                         from: 'users',
                         localField: 'user',
                         foreignField: '_id',
                         as: 'user',
                         pipeline: [
                              {
                                   $project: {
                                        user_name: 1,
                                        user_email: 1
                                   }
                              }
                         ]
                    }
               }, {
                    $unwind: {
                         path: '$user'
                    }
               }

          ])
          let rating = reviews.reduce((acc, rev) => {
               return acc + rev.rating;
          }, 0)
          rating = rating / reviews.length
          const ratingPerc = 100 * rating / 5;
          res.render("user/viewProduct", { product, rel_product, category, reviews, rating, ratingPerc });
     } catch (err) {
          next(err);
     }
};

const filterProducts = asyncHandler(async (req, res, next) => {
     let sortKey = 1
     let sortField
     let limitKey;//for setting limit from req.query

     if (req.query.sort === 'low-to-high') {
          sortField = 'prod_price';
     } else if (req.query.sort === 'high-to-low') {
          sortField = 'prod_price';
          sortKey = -1; // Change to descending order
     } else if (req.query.sort === 'newest-first') {
          sortField = 'createdAt';
          sortKey = -1;
     }
     let products = await Product.aggregate([
          {
               $match: { product_status: true, is_delete: false }
          },
          {
               $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
               }
          },
          {
               $unwind: {
                    path: '$category'
               }
          },
          {
               $sort: {
                    [sortField]: sortKey
               }
          },
     ])


     if (req.query.category) {
          const filterKey = req.query.category
          products = products.filter((product) => {
               return filterKey.includes(product.category.cat_name)
          })
     }
     if (req.query.brand) {
          const filterKey = req.query.brand
          products = products.filter((product) => {
               return filterKey.includes(product.brand_name)
          })
     }
     if (req.query.search) {
          products = products.filter((product) => {
               const searchTerm = req.query.search.toLowerCase().replace(/\s/g, "");

               const prod = product.product_name.toLowerCase().replace(/\s/g, "");
               if (prod.includes(searchTerm) || searchTerm.includes(prod)) {
                    return true
               }

               const brand = product.brand_name.toLowerCase().replace(/\s/g, "");
               if (brand.includes(searchTerm) || searchTerm.includes(brand)) {
                    return true
               }

               const category = product.category.cat_name.toLowerCase().replace(/\s/g, "");
               if (category.includes(searchTerm) || searchTerm.includes(category)) {
                    return true
               }

          });
     }
     //geting all categories
     let bannerCat=products.map((prod)=>{
          return prod.category._id
     })
     let uniqueCat=[];
     for (const item of bannerCat) {
          if (!uniqueCat.includes(item.toString())) {
               uniqueCat.push(item.toString());
          }
        }
     uniqueCat=uniqueCat.map((cat)=>new mongoose.Types.ObjectId(cat))
     const banners=await Banner.find({
          category:{$in:uniqueCat},
          banner_status: true,
          starting_date: { $lte: new Date() },
          exp_date: { $gt: new Date() }
     })
    


     //pagination
     const length = products.length / 5;
     const page = [];
     for (let i = 0; i < length; i++) {
          page.push(i)
     }
     if (req.query.limit) {
          limitKey = parseInt(req.query.limit) * 5;
     } else {
          limitKey = 0;
     }
     products = products.splice(limitKey, limitKey + 5)
     //categories for filter
     const category = await Category.find({ is_delete: false, cat_status: true })
     //brands for filter
     const brands = await Product.aggregate([
          { $match: { is_delete: false, product_status: true } },
          { $group: { _id: "$brand_name", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $project: { _id: 1 } },
          { $limit: 6 },
     ]);

     // if there is any limit then setting the new limit otherwise otherwise 0 for displaying current page
     if (req.query.limit) {
          limitKey = req.query.limit
     }
     res.render('user/filterList', { products, search: req.query.search, userData: res.locals.userData, category, brands, page, limitKey, banners })

})

module.exports = {
     viewProduct,
     filterProducts
};
