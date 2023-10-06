const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");


function similarity(s1, s2) {
     let longer = s1;
     let shorter = s2;
     if (s1.length < s2.length) {
          longer = s2;
          shorter = s1;
     }
     let longerLength = longer.length;
     if (longerLength === 0) {
          return 1.0;
     }
     return (
          (longerLength - editDistance(longer, shorter)) /
          parseFloat(longerLength)
     );
}

function editDistance(s1, s2) {
     s1 = s1.toLowerCase();
     s2 = s2.toLowerCase();
     s1 = s1.replace(/\s/g, "")
     s2 = s2.replace(/\s/g, "")



     let costs = new Array();
     for (let i = 0; i <= s1.length; i++) {
          let lastValue = i;
          for (let j = 0; j <= s2.length; j++) {
               if (i == 0) costs[j] = j;
               else {
                    if (j > 0) {
                         let newValue = costs[j - 1];
                         if (s1.charAt(i - 1) != s2.charAt(j - 1))
                              newValue =
                                   Math.min(
                                        Math.min(newValue, lastValue),
                                        costs[j]
                                   ) + 1;
                         costs[j - 1] = lastValue;
                         lastValue = newValue;
                    }
               }
          }
          if (i > 0) costs[s2.length] = lastValue;
     }
     return costs[s2.length];
}



const sheckSubstring=(str,sub)=>{


}

const viewProduct = async (req, res, next) => {
     try {
          const product = await Product.findById(req.params.id);
          const category = await Category.find();
          const rel_product = await Product.find({
               category: product.category,
               _id: { $nin: [product._id] },
               is_delete: false,
               product_status: true,
          }).limit(4);
          if (product.product_status == false || product.is_delete == true) {
               req.flash('error', 'Product cannot find!')
               res.redirect('/')
          }
          res.render("user/viewProduct", { product, rel_product, category });
     } catch (err) {
          next(err);
     }
};

const filterProducts = asyncHandler(async (req, res, next) => {
     let products = await Product.aggregate([
          {
               $match:{ product_status: true, is_delete: false }
          },
          {
               $lookup:{ 
                    from:'categories',
                    localField:'category',
                    foreignField:'_id',
                    as:'category'
               }
          },
          {
               $unwind:{
                    path:'$category'
               }
          }
     ])
     products = products.filter((product) => {
          const searchTerm = req.query.search.toLowerCase().replace(/\s/g, "");

          const prod = product.product_name.toLowerCase().replace(/\s/g, "");
          if(prod.includes(searchTerm) || searchTerm.includes(prod)){
               return true
          }

          const brand = product.brand_name.toLowerCase().replace(/\s/g, "");
          if(brand.includes(searchTerm) || searchTerm.includes(brand)){
               return true
          }

          const category = product.category.cat_name.toLowerCase().replace(/\s/g, "");
          if(category.includes(searchTerm) || searchTerm.includes(category)){
               return true
          }
           
      });

      res.render('user/filterList',{products,search:req.query.search,userData:res.locals.userData})

})

module.exports = {
     viewProduct,
     filterProducts
};
