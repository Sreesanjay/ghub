const express = require('express')
var router = express.Router();
//admin authentication       
const adminAuthCtrl=require('../controller/adminAuthCtrl')
//admin controller 
const adminCtrl=require('../controller/adminCtrl')
//auth middleware
const {isAdminLogedIn} =require('../middleware/authMiddleware');




//admin signup
router.post('/admin-sign-up',adminAuthCtrl.adminSignUp)

//admin dashboard
router.get('/',isAdminLogedIn,adminCtrl.getDashboard)
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





module.exports = router;