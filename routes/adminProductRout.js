const express = require('express')
var router = express.Router();
//admin authentication       
const adminProdCtrl = require('../controller/adminProductCtrl')
//admin controller 
const adminCtrl = require('../controller/adminCtrl')
//auth middleware
const { isAdminLogedIn } = require('../middleware/authMiddleware');

const path = require('path')
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/Images/Products'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + file.originalname+ Date.now() + path.extname(file.originalname));
  },
});

const multipleUpload = multer({
  storage:storage,
}).fields([{ name: 'primary_img', maxCount: 1 }, { name: 'secondary_img', maxCount: 8 }])



router.get('/', isAdminLogedIn, adminProdCtrl.getProducts)
//new product
router.get('/new-product', isAdminLogedIn,adminProdCtrl.newProduct)
router.post('/new-product',multipleUpload,adminProdCtrl.storeProduct)
//delete product
router.delete('/delete-product/:id', isAdminLogedIn, adminProdCtrl.deleteProduct)
//view product
router.get('/view-product/:id', isAdminLogedIn, adminProdCtrl.viewProduct)
//edit product
router.get('/edit-product/:id', isAdminLogedIn, adminProdCtrl.getEditProduct)
router.put('/edit-product/:id', isAdminLogedIn,multipleUpload,adminProdCtrl.editProduct)

module.exports = router;