const express = require('express')
var router = express.Router();
//admin authentication       
const adminOrderCtrl = require('../controller/adminOrderCtrl')
//auth middleware
const { isAdminLogedIn } = require('../middleware/authMiddleware');


router.get('/',isAdminLogedIn,adminOrderCtrl.getAllOrders)
//get order details of single product
router.get('/view-order',isAdminLogedIn,adminOrderCtrl.ViewOrderDetails)
router.put('/change-status',isAdminLogedIn,adminOrderCtrl.changeStatus)
router.post('/filter-order',isAdminLogedIn,adminOrderCtrl.filterOrder)

module.exports = router;