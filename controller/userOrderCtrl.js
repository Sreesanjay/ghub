const Product = require("../models/productModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Address = require("../models/addressModel");
const Coupon = require("../models/couponModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");

//creating instance of razorpay
let instance = new Razorpay({
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
          coupon.user_list.push(user._id)
          coupon.used_count++;
          coupon.save()
          for(let prod of order.products){
               prod.discount=discount/order.products.length;
          }
     }

     let newOrder = await Order.create(order);

     if (newOrder) {
          if (newOrder.payment_method === "COD") {
               //changing the status of order to confirmed from Payment pending
               newOrder.products.forEach((product) => {
                    product.status = "Confirmed";
                    product.confirmed_date=new Date()
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
                    amount: total*100,
                    currency: "INR",
                    receipt: newOrder._id.toString(),
               };

               instance.orders.create(
                    options,
                    async function (err, payment_details) {
                         if (err) {
                              throw new Error(err.message);
                         } else {
                              const date = new Date(
                                   payment_details.created_at * 1000
                              ); // Convert from seconds to milliseconds
                              
                              const formattedDate=date.toISOString();
                              let payment = new Payment({
                                   payment_id: payment_details.id,
                                   amount: parseInt(payment_details.amount)/100,
                                   currency: payment_details.currency,
                                   order_id: newOrder._id,
                                   status: payment_details.status,
                                   created_at: formattedDate,
                              });
                              await payment.save();
                              res.status(200).json({
                                   status: "paymentPending",
                                   key: process.env.RAZORPAY_KEY,
                                   amount: payment_details.amount,
                                   currency: payment_details.currency,
                                   name: "GHub",
                                   order_id: payment_details.id,
                                   prefill: {
                                        name: user.user_name,
                                        email: user.user_email,
                                        contact: user.user_mobile,
                                   },
                              });
                         }
                    }
               );
          }
     } else {
          throw new Error();
     }
});





//verify payment
const verifyPayment = asyncHandler(async (req, res) => {
     const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
     hmac.update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id);
     let generatedSignature = hmac.digest("hex");
     let isSignatureValid = generatedSignature === req.body.razorpay_signature;

     if (isSignatureValid) {

          let payment = await Payment.findOne({ payment_id: req.body.razorpay_order_id })
          let order = await Order.findById(payment.order_id)

          order.products.forEach(async (product) => {
               product.status = "Confirmed";
               product.confirmed_date=new Date()
               await Product.findByIdAndUpdate(product.product, {
                    $inc: { stock: -product.quantity },
               });
          });
          await order.save()
          //change cart to empty
          await User.findByIdAndUpdate(order.user, {
               $set: { cart: [] },
          });

           const payment_details=await instance.payments.fetch(req.body.razorpay_payment_id)
           if (payment_details) {
               if(payment_details.error){
                    throw new Error(error.message)
               }else{
                    console.log(payment_details)
                    payment.payment_method = payment_details.method;
               }
             };
          //change payment status to success
          payment.status = 'success';
          await payment.save();

          res.status(200).json({ status: "success" })

     } else {
          throw new Error("Invalid signature")
     }
});

module.exports = {
     getCheckout,
     proceedOrder,
     verifyPayment,
};
