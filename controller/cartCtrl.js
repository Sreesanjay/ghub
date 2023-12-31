const Product = require("../models/productModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

//get cart
const getCart = asyncHandler(async (req, res, next) => {
     const user = res.locals.userData._id;
     let cartList = await User.aggregate([
          { $match: { _id: user } },
          { $project: { cart: 1, _id: 0 } },
          { $unwind: { path: "$cart" } },
          {
               $lookup: {
                    from: "products",
                    localField: "cart.product_id",
                    foreignField: "_id",
                    as: "prod_detail",
               },
          },
          { $unwind: { path: "$prod_detail" } },
     ]);
     for (prod of cartList) {
          prod.price = prod.prod_detail.sellig_price * prod.cart.count;
     }
     for (let i = 0; i < cartList.length; i++) {
          if (cartList[i].cart.count > cartList[i].prod_detail.stock) {
               cartList[i].outOfStock = true;
          }
     }
     res.render("user/cart", { cartList, error: req.flash('error')[0] });
});

//add to cart
const addToCart = asyncHandler(async (req, res) => {
     const user = res.locals.userData._id;
     const product = new mongoose.Types.ObjectId(req.params.id);
     const newCart = await User.updateOne(
          {
               _id: user,
               cart: { $not: { $elemMatch: { product_id: product } } },
          },
          { $push: { cart: { product_id: product } } }
     );
     if (newCart.modifiedCount != 0) {
          console.log("successs");
          res.status(200).json({ status: "success" });
     } else {
          res.status(200).json({ status: "success", exist: true });
     }
});

// decrease cart quantity
const decCartCount = asyncHandler(async (req, res) => {
     const user_id = res.locals.userData._id;
     let user = await User.findById(user_id);
     if (user) {
          let cart = user.cart.find((item) => item.product_id == req.params.id);
          if (cart) {
               if (cart.count != 1) {
                    cart.count--;
                    await user.save();
                    res.status(200).json({ status: "success" });
               } else {
                    res.status(400).json({ status: "failed" });
               }
          } else {
               throw new Error();
          }
     }
});

// increase cart quantity
const addCartCount = asyncHandler(async (req, res) => {
     const user_id = res.locals.userData._id;
     let user = await User.findById(user_id);
     if (user) {
          let cart = user.cart.find((item) => item.product_id == req.params.id);
          if (cart) {
               const prod = await Product.findById(cart.product_id);
               if (cart.count < prod.stock) {
                    let newCart = await User.updateOne(
                         { _id: user, "cart.product_id": req.params.id },
                         { $inc: { "cart.$.count": 1 } },
                         { new: true }
                    );
                    if (newCart) {
                         res.status(200).json({ status: "success" });
                    } else {
                         throw new Error();
                    }
               } else {
                    const error = new Error("Stock limit exceeded");
                    error.statusCode = 400;
                    throw error;
               }
          }
     } else {
          throw new Error();
     }
});

// remove item from cart
const removeCartItem = asyncHandler(async (req, res, next) => {
     const product_id = new mongoose.Types.ObjectId(req.params.id);
     const user = res.locals.userData._id;
     const newCart = await User.updateOne(
          { _id: user },
          { $pull: { cart: { product_id: product_id } } }
     );
     if (newCart) {
          res.status(200).json({ status: "success" });
     } else {
          throw new Error();
     }
});

module.exports = {
     addToCart,
     getCart,
     addCartCount,
     decCartCount,
     removeCartItem,
};
