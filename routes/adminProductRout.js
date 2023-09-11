const express = require('express')
var router = express.Router();
//admin authentication       
const adminProdCtrl=require('../controller/adminProductCtrl')
//admin controller 
const adminCtrl=require('../controller/adminCtrl')
//auth middleware
const {isAdminLogedIn} =require('../middleware/authMiddleware');

router.get('/',isAdminLogedIn,adminProdCtrl.getProducts)
//new category
router.get('/new-product',isAdminLogedIn,adminProdCtrl.newProduct)
router.post('/new-product',isAdminLogedIn,adminProdCtrl.storeProduct)


module.exports=router;