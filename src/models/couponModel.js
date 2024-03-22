const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
     {
          coupon_code: {
               type: String,
               required: true,
          },
          discount: {
               type: Number,
               required: true,
          },
          start_date: {
               type: Date,
               required: true,
          },
          exp_date: {
               type: Date,
               required: true,
          },
          max_count: {
               type: Number,
               required: true,
          },
          used_count: {
               type: Number,
               default: 0,
          },
          discription: {
               type: String,
          },
          is_delete: {
               type: Boolean,
               required: true,
               default: false,
          },
          user_list: [
               {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
               },
          ],
     },
     { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Coupon", couponSchema);
