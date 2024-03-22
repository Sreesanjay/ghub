const express = require('express');
const {getUserData} = require('../middleware/authMiddleware')
const userCtrl=require('../controller/userCtrl')
const userAuthCtrl=require('../controller/userAuthCtrl')
const productCtrl=require('../controller/productCtrl')
const router = express.Router();
//----sub routes-------
const accountRoute = require('./userProfile')
const cartRoute = require('./userCartRout')
const orderRoute = require('./orderRout')

router.get('/',getUserData,userCtrl.getHomePage)
router.get('/login',userAuthCtrl.getLoginPage)
router.get('/sign-up',userAuthCtrl.getSignUpPage)
router.post('/get-signup-otp',userAuthCtrl.genOtp)
router.post('/user-sign-up',userAuthCtrl.registerUser)
router.post('/user-log-in',userAuthCtrl.loginUser)
router.get('/user-logout',userAuthCtrl.logoutUser)

router.get('/products',getUserData,productCtrl.filterProducts)
router.get('/view-product/:id',getUserData,productCtrl.viewProduct)

//sub routes
router.use('/account', accountRoute)
router.use('/my-cart', cartRoute)
router.use('/order', orderRoute)

module.exports =router;