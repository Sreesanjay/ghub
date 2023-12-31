const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");


//render all coupons
const getCouponManagement = asyncHandler(async (req, res) => {
     let coupons = await Coupon.find({ is_delete: false });
     coupons = coupons.map((coupon) => {
          return {
               ...coupon.toObject(),
               start_date: new Date(coupon.start_date).toLocaleDateString(),
               exp_date: new Date(coupon.exp_date).toLocaleDateString(),
          };
     });
     res.render("admin/coupons", { coupons });
});


//render new coupons
const getnewCoupon = asyncHandler(async (req, res) => {
     res.render("admin/newCoupon");
});


//save new coupons
const saveCoupon = asyncHandler(async (req, res) => {
     await Coupon.create(req.body);
     res.status(200).json({ status: "success" });
});


//delete coupons
const deleteCoupon = asyncHandler(async (req, res) => {
     await Coupon.findByIdAndUpdate(req.params.id, {
          $set: { is_delete: true },
     });
     res.status(200).json({ status: "success" });
});


//render edit coupon
const getEditCoupon = asyncHandler(async (req, res) => {
     let coupon = await Coupon.findById(req.params.id);
     coupon = coupon.toObject();

     const parsedDate = new Date(coupon.start_date);
     const year = parsedDate.getUTCFullYear();
     const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
     const day = String(parsedDate.getUTCDate()).padStart(2, "0");
     coupon.start_date = `${year}-${month}-${day}`;

     const parsedExp = new Date(coupon.exp_date);
     const exp_year = parsedExp.getUTCFullYear();
     const exp_month = String(parsedExp.getUTCMonth() + 1).padStart(2, "0");
     const exp_day = String(parsedExp.getUTCDate()).padStart(2, "0");
     coupon.exp_date = `${exp_year}-${exp_month}-${exp_day}`;
     res.render("admin/editCoupon", { coupon });
});


//save edited coupon
const updateCoupon = asyncHandler(async (req, res) => {
     const newCpn = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
     });
     if (newCpn) {
          res.status(200).json({
               status: "success",
          });
     } else {
          throw new Error();
     }
});

module.exports = {
     getCouponManagement,
     getnewCoupon,
     saveCoupon,
     deleteCoupon,
     getEditCoupon,
     updateCoupon,
};
