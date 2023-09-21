const express = require('express');
const userProfileCtrl=require('../controller/userProfileCtrl')
const {isUserLogedIn} =require('../middleware/authMiddleware');
var router = express.Router();


router.get('/',isUserLogedIn,isUserLogedIn,userProfileCtrl.getMyAccount)
router.post('/verify-password',isUserLogedIn,userProfileCtrl.verifyOldPass)
router.post('/change-password',isUserLogedIn,userProfileCtrl.changePassword)

router.post('/editProfile',isUserLogedIn,userProfileCtrl.editProfile)

//user address
router.get('/my-address',isUserLogedIn,userProfileCtrl.getAllAddress)
router.post('/new-address',isUserLogedIn,userProfileCtrl.newAddress)
router.put('/edit-address/:id',isUserLogedIn,userProfileCtrl.editAddress)
router.delete('/delete-address/:id',isUserLogedIn,userProfileCtrl.deleteAddress)

//wishlist
router.get('/add-to-wishlist/:id',isUserLogedIn,userProfileCtrl.addToWishlist)
router.get('/my-wishlist',isUserLogedIn,userProfileCtrl.getWishlist)
router.get('/delete-wish/:id',isUserLogedIn,userProfileCtrl.deleteWish)




module.exports=router;