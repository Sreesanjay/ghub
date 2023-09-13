const express = require('express')
var router = express.Router();
//admin authentication       
const adminProdCtrl=require('../controller/adminProductCtrl')
//admin controller 
const adminCtrl=require('../controller/adminCtrl')
//auth middleware
const {isAdminLogedIn} =require('../middleware/authMiddleware');

const path=require('path')
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/Images/Products'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" +file.originalname+"-"+ Date.now() + path.extname(file.originalname));
  },
});

const upload= multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/webp'
    ) {
      cb(null, true); // Allow the upload
    } else {
      console.log("err")
      const error = new Error('Unsupported file format');
      cb(null, false,error); // Pass the error to multer
    }
  },
})
const multipleUpload=upload.fields([{ name: 'prod_img_1', maxCount: 1 }, { name: 'prod_img_2', maxCount: 3 }])


router.get('/',isAdminLogedIn,adminProdCtrl.getProducts)
//new category
router.get('/new-product',isAdminLogedIn,adminProdCtrl.newProduct)
router.post('/new-product',isAdminLogedIn,multipleUpload,adminProdCtrl.storeProduct)
//delete product
router.delete('/delete-product/:id',isAdminLogedIn,adminProdCtrl.deleteProduct)
//view product
router.get('/view-product/:id',isAdminLogedIn,adminProdCtrl.viewProduct)
//edit product
router.get('/edit-product/:id',isAdminLogedIn,adminProdCtrl.getEditProduct)
//edit product
router.post('/edit-product',isAdminLogedIn,adminProdCtrl.editProduct)

module.exports=router;