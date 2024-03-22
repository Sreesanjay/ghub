const express = require('express');
const { isUserLogedIn } = require('../middleware/authMiddleware');
const orderCtrl = require('../controller/userOrderCtrl')
var router = express.Router();

router.get('/get-checkout', isUserLogedIn, orderCtrl.getCheckout)
router.post('/proceed-order', isUserLogedIn, orderCtrl.proceedOrder)
router.post('/payment/verify-payment', isUserLogedIn, orderCtrl.verifyPayment)
router.get('/order-success', isUserLogedIn, orderCtrl.getSuccessPage)
router.get('/print-invoice', orderCtrl.printInvoice)
router.post('/cancel-order', isUserLogedIn, orderCtrl.cancelOrder)
router.post('/return-order', isUserLogedIn, orderCtrl.returnOrder)

module.exports = router