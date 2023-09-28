const express = require('express')
var router = express.Router();
//admin authentication       
const adminOrderCtrl = require('../controller/adminOrderCtrl')
//auth middleware
const { isAdminLogedIn } = require('../middleware/authMiddleware');


router.get('/',isAdminLogedIn,adminOrderCtrl.getAllOrders)

module.exports = router;