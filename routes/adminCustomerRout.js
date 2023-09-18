const express = require('express')
var router = express.Router();
//admin authentication       
const adminAuthCtrl=require('../controller/adminAuthCtrl')
const adminCustomerCtrl=require('../controller/adminCustomerCtrl')
//admin controller 
const adminCtrl=require('../controller/adminCtrl')
//auth middleware
const {isAdminLogedIn} =require('../middleware/authMiddleware');

router.get('/',isAdminLogedIn,adminCustomerCtrl.getCustomer)
router.get('/block-customer/:id',isAdminLogedIn,adminCustomerCtrl.blockCustomer)
router.get('/unblock-customer/:id',isAdminLogedIn,adminCustomerCtrl.unblockCustomer)
module.exports=router;