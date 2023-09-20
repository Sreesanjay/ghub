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



module.exports=router;