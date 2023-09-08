const express = require('express')
var router = express.Router();
//admin authentication       
const adminAuthCtrl=require('../controller/adminAuthCtrl')
//auth middleware
const {isAdminLogedIn} =require('../middleware/authMiddleware');
//admin signup
router.post('/admin-sign-up',adminAuthCtrl.adminSignUp)
//admin login 
router.get('/admin-sign-in',adminAuthCtrl.adminLoginPage)
router.post('/admin-sign-in',adminAuthCtrl.adminlogin)
router.get('/dash',isAdminLogedIn,adminAuthCtrl.adminlogin)
module.exports = router;