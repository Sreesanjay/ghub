const express = require('express');
const {isUserLogedIn} =require('../middleware/authMiddleware');
const {getUserData} = require('../middleware/authMiddleware')
const userCtrl=require('../controller/userCtrl')
const userAuthCtrl=require('../controller/userAuthCtrl')
const productCtrl=require('../controller/productCtrl')
var router = express.Router();


router.get('/',getUserData,userCtrl.getHomePage)
router.get('/products/filter',userCtrl.filterProducts)
router.get('/login',userAuthCtrl.getLoginPage)
router.get('/sign-up',userAuthCtrl.getSignUpPage)
router.post('/get-signup-otp',userAuthCtrl.genOtp)
router.post('/user-sign-up',userAuthCtrl.registerUser)
router.post('/user-log-in',userAuthCtrl.loginUser)
router.get('/user-logout',userAuthCtrl.logoutUser)

router.get('/view-product/:id',getUserData,productCtrl.viewProduct)

//cart
router.get('/my-cart',isUserLogedIn,userCtrl.getCart)
router.get('/add-to-cart/:id',isUserLogedIn,userCtrl.addToCart)
router.get('/my-cart/add-count/:id',isUserLogedIn,userCtrl.addCartCount)
router.get('/my-cart/dec-count/:id',isUserLogedIn,userCtrl.decCartCount)
router.delete('/my-cart/remove-item/:id',isUserLogedIn,userCtrl.removeCartItem)
router.get('/my-cart/get-checkout',isUserLogedIn,userCtrl.getCheckout)


module.exports =router;