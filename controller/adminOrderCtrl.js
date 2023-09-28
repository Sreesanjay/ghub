const Product = require("../models/productModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Address = require("../models/addressModel");
const Coupon = require("../models/couponModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const Razorpay = require("razorpay");
const crypto = require('crypto');

//creating instance of razorpay
var instance = new Razorpay({
     key_id: process.env.RAZORPAY_KEY,
     key_secret: process.env.RAZORPAY_SECRET,
});

const getCheckout = asyncHandler(async (req, res, next) => {
     const user = res.locals.userData._id;
     const address = await Address.find({ user_id: user });
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
     let prodTotal = 0;
     for (prod of cartList) {
          prod.price = prod.prod_detail.sellig_price * prod.cart.count;
          prodTotal += prod.price;
     }
     cartList.prodTotal = prodTotal;
     if (req.query.cpn) {
          let cpn = await Coupon.findById(req.query.cpn);
          let total =
               cartList.prodTotal - (cartList.prodTotal * cpn.discount) / 100;
          cartList.total = Math.round(total);
          cartList.discount = Math.round(
               (cartList.prodTotal * cpn.discount) / 100
          );
     } else {
          cartList.total = cartList.prodTotal;
          cartList.discount = 0;
     }
     console.log(cartList);
     res.render("user/checkout", { address, cartList, cpnId: req.query.cpn });
});

//proceed order
const proceedOrder = asyncHandler(async (req, res) => {
     let order = {};
     const user = await User.findById(res.locals.userData._id);
     let cart = user.cart;
     //     console.log(req.body)
     order.user = user._id;
     order.products = [];
     for (let i = 0; i < cart.length; i++) {
          let prod = await Product.findById(cart[i].product_id);
          const products = {
               product: new mongoose.Types.ObjectId(cart[i].product_id),
               quantity: cart[i].count,
               price: prod.sellig_price * cart[i].count,
          };
          order.products.push(products);
     }
     let totalAmount = order.products.reduce((acc, prod) => {
          acc = acc + prod.price;
          return acc;
     }, 0);
     const address = await Address.findById(req.body.delivery_address);
     order.delivery_address = address;
     order.payment_method = req.body.payment_option;
     if (req.body.coupon_id) {
          const coupon = await Coupon.findById(req.body.coupon_id);
          let discount = Math.round((totalAmount * coupon.discount) / 100);
          order.coupon = {
               coupon_id: new mongoose.Types.ObjectId(req.body.coupon_id),
               discount: discount,
          };
     }

     let newOrder = await Order.create(order);

     if (newOrder) {
          if (newOrder.payment_method === "COD") {
               //changing the status of order to pending from Payment pending
               newOrder.products.forEach((product) => {
                    product.status = "Confirmed";
               });

               let confirmedOrder = await newOrder.save();

               if (confirmedOrder) {
                    confirmedOrder.products.forEach(async (product) => {
                         await Product.findByIdAndUpdate(product.product, {
                              $inc: { stock: -product.quantity },
                         });
                    });
                    await User.findByIdAndUpdate(confirmedOrder.user, {
                         $set: { cart: [] },
                    });
               }
               res.status(200).json({ status: "success" });
          } else {
               let total;
               if (newOrder.coupon?.discount) {
                    console.log(newOrder.coupon);
                    total = totalAmount - newOrder.coupon.discount;
               } else {
                    total = totalAmount;
               }

               var options = {
                    amount: total,
                    currency: "INR",
                    receipt: newOrder._id.toString(),
               };

               instance.orders.create(options, async function (err, payment_details) {
                    console.log(payment_details)
                    if (err) {
                         throw new Error(err.message);
                    } else {
                         const date = new Date(payment_details.created_at * 1000); // Convert from seconds to milliseconds

                         const year = date.getFullYear();
                         const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
                         const day = date.getDate().toString().padStart(2, '0');
                         const hours = date.getHours().toString().padStart(2, '0');
                         const minutes = date.getMinutes().toString().padStart(2, '0');
                         const seconds = date.getSeconds().toString().padStart(2, '0');

                         const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                         let payment = new Payment({
                              payment_id: payment_details.id,
                              amount: payment_details.amount,
                              currency: payment_details.currency,
                              receipt: payment_details.receipt,
                              status: payment_details.status,
                              created_at: formattedDate
                         });
                         await payment.save()
                         res.status(200).json({
                              status: 'paymentPending',
                              key: process.env.RAZORPAY_KEY,
                              amount: payment_details.amount,
                              currency: payment_details.currency,
                              name: "GHub",
                              order_id:payment_details.id,
                              prefill: {
                                   name: user.user_name,
                                   email: user.user_email,
                                   contact: user.user_mobile
                              }
                         })
                    }
               });
          }
     } else {
          throw new Error();
     }
});

module.exports = {
     getCheckout,
     proceedOrder,
};
