const express = require('express')
var router = express.Router();
const {isAdminLogedIn} =require('../middleware/authMiddleware');
const bannerCtrl=require('../controller/adminBannerCtrl')

const path = require('path')
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/Images/Banners'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + file.originalname+ Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage:storage,
  limits: { fieldSize: 25 * 1024 * 1024 }
}).single('image')


router.get('/',isAdminLogedIn,bannerCtrl.getAllBanners);
router.get('/new-banner',isAdminLogedIn,bannerCtrl.newBanner);
router.post('/new-banner',isAdminLogedIn,upload,bannerCtrl.saveBanner);
router.get('/edit-banner/:id',isAdminLogedIn,bannerCtrl.getEditBanner);
router.put('/edit-banner/:id',isAdminLogedIn,upload,bannerCtrl.putEditBanner);
router.get('/delete-banner/:id',isAdminLogedIn,bannerCtrl.deleteBanner);

module.exports=router