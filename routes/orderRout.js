const express = require('express');
const {isUserLogedIn} =require('../middleware/authMiddleware');
const {getUserData} = require('../middleware/authMiddleware')
const orderCtrl = require('../controller/userOrderCtrl')
var router = express.Router();

router.get('/get-checkout',isUserLogedIn,orderCtrl.getCheckout)
router.post('/proceed-order',isUserLogedIn,orderCtrl.proceedOrder)
router.post('/payment/verify-payment',isUserLogedIn,orderCtrl.verifyPayment)


module.exports=router