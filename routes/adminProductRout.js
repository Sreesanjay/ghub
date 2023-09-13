const express = require('express')
var router = express.Router();
const multer = require('multer');
const path = require('path');
//admin authentication       
const adminProdCtrl=require('../controller/adminProductCtrl')
//admin controller 
const adminCtrl=require('../controller/adminCtrl')
//auth middleware
const {isAdminLogedIn} =require('../middleware/authMiddleware');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../public/Images/Products'))
    },
    filename: function (req, file, cb) {
      cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname),(err,success) => {
        if(err) throw err;
      });
  }
  })

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if(
        file.mimetype=='image/jpeg'||
        file.mimetype=='image/png'||
        file.mimetype=='image/jpg'||
        file.mimetype=='image/webp'

      ){
        cb(null,true)
      }
      else{
        cb(null,false);
      }
    },
  })
let multipleUpload = upload.fields([{ name: 'prod_img_1',maxCount:1 }, { name: 'prod_img_2',maxCount:3 }])
router.get('/',isAdminLogedIn,adminProdCtrl.getProducts)
//new category
router.get('/new-product',isAdminLogedIn,adminProdCtrl.newProduct)
router.post('/new-product',multipleUpload,isAdminLogedIn,adminProdCtrl.storeProduct)
//delete product
router.delete('/delete-product/:id',isAdminLogedIn,adminProdCtrl.deleteProduct)

module.exports=router;