const express = require('express')
const router = express.Router();
const adminAuthCtrl=require('../controller/adminAuthCtrl') //admin authentication      
const adminCtrl=require('../controller/adminCtrl') //admin controller 
const {isAdminLogedIn} =require('../middleware/authMiddleware'); //auth middleware

//---------sub routes------------------
const categoryRoute = require('./adminCatRout')
const productRoute = require('./adminProductRout');
const customerRoute = require('./adminCustomerRout')
const bannerRoute = require('./adminBannerRout')
const couponRoute =  require('./adminCouponRout')
const orderRoute = require('./adminOrderRout')
const salesRoute =  require('./adminSaleReportRout')


//admin signup
router.post('/admin-sign-up',adminAuthCtrl.adminSignUp)
//admin dashboard
router.get('/',isAdminLogedIn,adminCtrl.getDashboard)
router.get('/getRevenue',isAdminLogedIn,adminCtrl.getRevenue) //for diagram
//admin login 
router.get('/admin-sign-in',adminAuthCtrl.adminLoginPage)
router.post('/admin-sign-in',adminAuthCtrl.adminlogin)
//admin-forgot password
router.get('/forgot-password',adminAuthCtrl.forgotPassword)
router.post('/forgot-password/verify-mail',adminAuthCtrl.getOtpForgotPass)
router.post('/forgot-password/verify-otp',adminAuthCtrl.verifyOtp)
router.get('/forgot-password/reset-password',adminAuthCtrl.resetPassword)
router.post('/forgot-password/reset-password',adminAuthCtrl.updatePassword)
//logout
router.get('/sign-out',adminAuthCtrl.signOut)

//sub routes
router.use('/category',categoryRoute)
router.use('/products', productRoute);
router.use('/customers', customerRoute);
router.use('/banner-management', bannerRoute)
router.use('/coupon-management', couponRoute)
router.use('/orders',orderRoute)
router.use('/sales-report', salesRoute)



module.exports = router;