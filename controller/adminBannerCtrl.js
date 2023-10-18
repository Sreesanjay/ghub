const Banner = require("../models/bannerModel");
const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const mongoose = require("mongoose");



//render all banners
const getAllBanners = asyncHandler(async (req, res, next) => {
     let allBanners = await Banner.find();
     allBanners = allBanners.map((banner) => {
          return {
               ...banner.toObject(),
               starting_date: new Date(
                    banner.starting_date
               ).toLocaleDateString(),
               exp_date: new Date(banner.exp_date).toLocaleDateString(),
          };
     });
     res.render("admin/adminBanner", {
          allBanners,
          success: req.flash("success")[0],
     });
});


//render new banner 
const newBanner = asyncHandler(async (req, res, next) => {
     const category = await Category.find({is_delete:false}, { cat_name: 1 });
     res.render("admin/newBanner", { category });
});


//save new banner
const saveBanner = asyncHandler(async (req, res, next) => {
     req.body.image = {
          filename: req.file.filename,
          originalname: req.file.originalname,
          path: req.file.path,
     };
     console.log(req.body)
     const banner = new Banner(req.body);
     banner.save();
     res.status(200).json({ status: "success" });
});


//render banner edit page
const getEditBanner = asyncHandler(async (req, res, next) => {
     let banner = await Banner.findById(req.params.id);

     const parsedDate = new Date(banner.starting_date);
     const year = parsedDate.getUTCFullYear();
     const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
     const day = String(parsedDate.getUTCDate()).padStart(2, "0");
     banner.st_date = `${year}-${month}-${day}`;

     const parsedExp = new Date(banner.exp_date);
     const exp_year = parsedExp.getUTCFullYear();
     const exp_month = String(parsedExp.getUTCMonth() + 1).padStart(2, "0");
     const exp_day = String(parsedExp.getUTCDate()).padStart(2, "0");
     banner.expdate = `${exp_year}-${exp_month}-${exp_day}`;

     const categoryId = banner.category;
     banner.category = await Category.findById(banner.category, {
          cat_name: 1,
     });

     const category = await Category.find(
          { _id: { $nin: [categoryId] } },
          { cat_name: 1 }
     );
     res.render("admin/editBanner", { banner, category });
});


//save edited banner
const putEditBanner = asyncHandler(async (req, res, next) => {
     if (req.file?.filename) {
          req.body.image = {
               filename: req.file.filename,
               originalname: req.file.originalname,
               path: req.file.path,
          };
     } else {
          delete req.body.image;
     }
     const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
     });
     if (banner) {
          res.json({ status: "success" });
     } else {
          throw new Error();
     }
});


//delete banner
const deleteBanner = asyncHandler(async (req, res, next) => {
     const banner = await Banner.findByIdAndDelete(req.params.id, {
          new: true,
     });
     if (banner) {
          res.status(200).json({ status: "success" });
     } else {
          const error = new Error();
          error.statusCode = 500;
          throw error;
     }
});


module.exports = {
     getAllBanners,
     newBanner,
     saveBanner,
     deleteBanner,
     getEditBanner,
     putEditBanner,
};
