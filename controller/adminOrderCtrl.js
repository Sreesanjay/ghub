const Product = require("../models/productModel");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Address = require("../models/addressModel");
const Coupon = require("../models/couponModel");
const User = require("../models/userModel");

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
     let prodTotal=0;
     for (prod of cartList) {
          prod.price = prod.prod_detail.sellig_price * prod.cart.count;
          prodTotal+=prod.price;
     }
     cartList.prodTotal = prodTotal;
     if(req.query.cpn){
        let cpn=await Coupon.findById(req.query.cpn)
        let total=(cartList.prodTotal)-((cartList.prodTotal)*cpn.discount)/100;
        cartList.total=Math.round(total);
        cartList.discount=Math.round(((cartList.prodTotal)*cpn.discount)/100);
     }
     else{
        cartList.total=cartList.prodTotal
        cartList.discount=0
     }
     console.log(cartList)
     res.render("user/checkout", { address, cartList , cpnId:req.query.cpn});
});

//proceed order
const proceedOrder=asyncHandler(async(req,res)=>{
    const user=await User.findById(res.locals.userData._id);
    let cart = user.cart;
    

})

module.exports = {
     getCheckout,
     proceedOrder
};
