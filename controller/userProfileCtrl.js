const Category = require("../models/categoryModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const OTP = require("../models/otpModel");
const Address = require("../models/addressModel");
const Product = require("../models/productModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

const getMyAccount = asyncHandler(async (req, res) => {
     const user = await User.findById(res.locals.userData._id);
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
     ]);
     res.render("user/myAccount", { category, user, account: true });
});

const verifyOldPass = asyncHandler(async (req, res) => {
     const user = await User.findById(res.locals.userData._id);
     if (user) {
          const oldPass = req.body.old_pass;
          const user_password = user.user_password;
          const auth = await bcrypt.compare(oldPass, user_password);
          if (auth) {
               res.status(200).json({
                    status: "success",
               });
          } else {
               console.log("Error");
               res.status(400).json({ status: "error" });
          }
     }
});

const changePassword = asyncHandler(async (req, res) => {
     const salt = await bcrypt.genSalt(10);
     const user_password = await bcrypt.hash(req.body.user_password, salt);
     const newPass = await User.findByIdAndUpdate(res.locals.userData._id, {
          user_password,
     });
     if (newPass) {
          res.status(200).json({ status: "success" });
     } else {
          throw new Error();
     }
});

//POST requset for edit profile
const editProfile = asyncHandler(async (req, res, next) => {
     const checkOtp = await OTP.findOne({ email: req.body.user_email });
     if (checkOtp) {
          const cmp = await bcrypt.compare(req.body.otp, checkOtp.otp);
          delete req.body.otp;
          if (cmp) {
               const newUser = await User.findByIdAndUpdate(
                    res.locals.userData._id,
                    req.body,
                    { new: true }
               );
               console.log(newUser);
               if (newUser) {
                    res.status(200).json({ status: "success" });
               } else {
                    throw new Error();
               }
          } else {
               const error = new Error("Invalid OTP");
               error.statusCode = 400;
               throw error;
          }
     }
});

//GET request for user address
const getAllAddress = asyncHandler(async (req, res, next) => {
     const address = await Address.find({ user_id: res.locals.userData._id });
     res.render("user/myAddress", { address, account: true });
});

//POST request for storing new address
const newAddress = asyncHandler(async (req, res, next) => {
     req.body.user_id = res.locals.userData._id;
     const newAddress = await Address.create(req.body);
     if (newAddress) {
          console.log(newAddress);
          res.status(200).json({ status: "success" });
     } else {
          throw new Error();
     }
});

const editAddress = asyncHandler(async (req, res, next) => {
     const newAddress = await Address.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
     );
     if (newAddress) {
          res.status(200).json({ status: "success" });
     } else {
          throw new Error();
     }
});

const deleteAddress = asyncHandler(async (req, res, next) => {
     const dlt = await Address.findByIdAndDelete(req.params.id);
     res.json({ status: "success" });
});

//add to wishlist
const addToWishlist = asyncHandler(async (req, res, next) => {
     const product_id = new mongoose.Types.ObjectId(req.params.id);
     const user = res.locals.userData._id;
     let wishlist;
     const exist = await User.findOne({
          _id: user,
          wishlist: { $elemMatch: { product_id: product_id } },
     });
     if (exist) {
          wishlist = await User.updateOne(
               { _id: user },
               { $pull: { wishlist: { product_id: product_id } } }
          );
     } else {
          wishlist = await User.updateOne(
               { _id: user },
               { $push: { wishlist: { product_id } } }
          );
     }
     if (wishlist) {
          res.status(200).json({ status: "success" });
     } else {
          throw new Error();
     }
});

const getWishlist = asyncHandler(async (req, res, next) => {
     let user = res.locals.userData.wishlist;
     let wishlist = [];
     user.map((x) => {
          wishlist.push(x.product_id);
          return x;
     });
     let product = await Product.find({ _id: { $in: wishlist } });

     res.render("user/wishlist", { product, account: true });
});

//delete wish list
const deleteWish = asyncHandler(async (req, res, next) => {
     const product_id = new mongoose.Types.ObjectId(req.params.id);
     const user = res.locals.userData._id;
     const newWishlist = await User.updateOne(
          { _id: user },
          { $pull: { wishlist: { product_id: product_id } } }
     );
     if (newWishlist) {
          res.status(200).json({ status: "success" });
     } else {
          throw new Error();
     }
});

module.exports = {
     getMyAccount,
     verifyOldPass,
     changePassword,
     editProfile,
     getAllAddress,
     newAddress,
     deleteAddress,
     editAddress,
     addToWishlist,
     getWishlist,
     deleteWish,
};
