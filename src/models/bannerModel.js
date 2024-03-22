const mongoose = require("mongoose");

var bannerSchema = new mongoose.Schema(
     {
          banner_type: {
               type: String,
               required: true,
          },
          category: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Category",
               required: true,
          },
          starting_date: {
               type: Date,
               required: true,
          },
          exp_date: {
               type: Date,
               required: true,
          },
          image: {
               filename: String,
               originalname: String,
               path: String,
          },
          reference: {
               type: String,
               required: true,
          },
          banner_status: {
               type: String,
               required: true,
               default: true,
          },
     },
     {
          timestamps: true,
     }
);

//Export the model
module.exports = mongoose.model("Banner", bannerSchema);
