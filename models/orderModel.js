const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
     user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model for the user who placed the order
          required: true,
     },
     products: [
          {
               product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product", // Reference to the Product model for each product in the order
                    required: true,
               },
               quantity: {
                    type: Number,
                    required: true,
               },
               price: {
                    type: Number,
                    required: true,
               },
               status: {
                    type: String,
                    enum: [
                         "Payment pending",
                         "Confirmed",
                         "Shipped",
                         "Out for delivery",
                         "Delivered",
                         "Canceled",
                    ],
                    default: "Payment pending",
               },
               confirmed_date:{
                type:Date
               },
               shipped_date:{
                type:Date
               },
               out_for_delivery_date:{
                 type:Date
               },
               delivered_date:{
                type:Date
               },
               cancelled_date:{
                type:Date
               }

          },
     ],

     orderDate: {
          type: Date,
          default: Date.now,
     },
     delivery_address: {
          user_name: {
               type: String,
               required: true,
          },
          user_id: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
               required: true,
          },
          phone: {
               type: String,
               required: true,
          },
          pincode: {
               type: Number,
               required: true,
          },
          locality: {
               type: String,
               required: true,
          },
          area_street: {
               type: String,
               required: true,
          },
          town: {
               type: String,
               required: true,
          },
          state: {
               type: String,
               required: true,
          },
          alternate_phone: {
               type: String,
          },
          address_type: {
               type: String,
               required: true,
          },
          landmark: {
               type: String,
          },
     },
     coupon: {
          coupon_id:{
               type: mongoose.Schema.Types.ObjectId,
               ref: 'Coupon',
          },
          discount:{
               type:Number
          }
      },
     payment_method: {
          type: String,
          enum: ['COD','ONLINE'],
          required: true,
     },
});


const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
