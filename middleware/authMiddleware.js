const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
module.exports.isAdminLogedIn = (req, res, next) => {
     const token = req.cookies.adminToken;
     if (token) {
          jwt.verify(
               token,
               process.env.SECRET_KEY,
               async (err, decodedToken) => {
                    if (err) {
                         res.redirect("/admin/admin-sign-in");
                    } else {
                         const admin = await Admin.findById(decodedToken.id);
                         delete admin.admin_password;
                         res.locals.adminData = admin;
                         next();
                    }
               }
          );
     } else {
          res.redirect("/admin/admin-sign-in");
     }
};

module.exports.isUserLogedIn = (req, res, next) => {
     const token = req.cookies.userToken;
     if (token) {
          jwt.verify(
               token,
               process.env.SECRET_KEY,
               async (err, decodedToken) => {
                    if (err) {
                         res.redirect("/login");
                    } else {
                         const userId = new mongoose.Types.ObjectId(
                              decodedToken.id
                         );
                         const user = await User.findOne({
                              _id: userId,
                              user_status: true,
                         });
                         if (user) {
                              delete user.user_password;
                              res.locals.userData = user;
                              next();
                         } else {
                              req.flash("error", "Access denied");
                              res.cookie("userToken", "", { maxAge: 1 });
                              res.redirect("/login");
                         }
                    }
               }
          );
     } else {

          if (req.headers['x-requested-with'] === 'XMLHttpRequest' || req.headers.accept && req.headers.accept.includes('application/json') ) {
               const error = new Error('Unauthorized! Please login to continue');
               error.statusCode=401;
               throw error;
             } else {
               res.redirect('/login');
             }
     }
};

module.exports.getUserData = (req, res, next) => {
     const token = req.cookies.userToken;
     if (token) {
          jwt.verify(
               token,
               process.env.SECRET_KEY,
               async (err, decodedToken) => {
                    if (!err) {
                         const userId = new mongoose.Types.ObjectId(
                              decodedToken.id
                         );
                         const user = await User.findOne({
                              _id: userId,
                              user_status: true,
                         });
                         if (user) {
                              delete user.user_password;
                              res.locals.userData = user;
                         } else {
                              res.cookie("userToken", "", { maxAge: 1 });
                         }
                    }
               }
          );
     }
     next();
};
