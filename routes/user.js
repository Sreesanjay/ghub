const express = require('express');
const {isUserLogedIn} =require('../middleware/authMiddleware');
const {getUserData} = require('../middleware/authMiddleware')
const userCtrl=require('../controller/userCtrl')
const userAuthCtrl=require('../controller/userAuthCtrl')
const productCtrl=require('../controller/productCtrl')
var router = express.Router();


router.get('/',getUserData,userCtrl.getHomePage)
router.get('/login',userAuthCtrl.getLoginPage)
router.get('/sign-up',userAuthCtrl.getSignUpPage)
router.post('/get-signup-otp',userAuthCtrl.genOtp)
router.post('/user-sign-up',userAuthCtrl.registerUser)
router.post('/user-log-in',userAuthCtrl.loginUser)
router.get('/user-logout',userAuthCtrl.logoutUser)

router.get('/products',getUserData,productCtrl.filterProducts)
router.get('/view-product/:id',getUserData,productCtrl.viewProduct)

module.exports =router;