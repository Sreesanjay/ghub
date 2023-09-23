const express = require('express')
var router = express.Router();
const adminCouponCtrl=require('../controller/adminCouponCtrl')
const {isAdminLogedIn} =require('../middleware/authMiddleware');

router.get('/',isAdminLogedIn,adminCouponCtrl.getCouponManagement)
router.get('/new-coupon',isAdminLogedIn,adminCouponCtrl.getnewCoupon)
router.post('/new-coupon',isAdminLogedIn,adminCouponCtrl.saveCoupon)
router.delete('/delete-coupon/:id',isAdminLogedIn,adminCouponCtrl.deleteCoupon)
router.get('/edit-coupon/:id',isAdminLogedIn,adminCouponCtrl.getEditCoupon)
router.put('/edit-coupon/:id',isAdminLogedIn,adminCouponCtrl.updateCoupon)


module.exports=router