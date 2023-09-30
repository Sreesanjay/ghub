const express = require('express')
var router = express.Router();
//admin authentication       
const adminSalesCtrl = require('../controller/adminSalesCtrl')
//auth middleware
const { isAdminLogedIn } = require('../middleware/authMiddleware');

router.get('/',isAdminLogedIn,adminSalesCtrl.getSalesreport)
router.get('/get-invoice',isAdminLogedIn,adminSalesCtrl.getInvoice)


module.exports=router