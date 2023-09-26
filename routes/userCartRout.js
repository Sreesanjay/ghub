const express = require('express');
const {isUserLogedIn} =require('../middleware/authMiddleware');
const {getUserData} = require('../middleware/authMiddleware')
const cartCtrl=require('../controller/cartCtrl')
var router = express.Router();
//cart
router.get('/',isUserLogedIn,cartCtrl.getCart)
router.get('/add-to-cart/:id',isUserLogedIn,cartCtrl.addToCart)
router.get('/add-count/:id',isUserLogedIn,cartCtrl.addCartCount)
router.get('/dec-count/:id',isUserLogedIn,cartCtrl.decCartCount)
router.delete('/remove-item/:id',isUserLogedIn,cartCtrl.removeCartItem)


module.exports =router;