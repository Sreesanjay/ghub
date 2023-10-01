const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const mongoose = require("mongoose");

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

module.exports = {
     viewProduct,
};
