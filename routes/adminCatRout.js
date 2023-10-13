const express = require('express')
var router = express.Router();
//admin authentication       
const adminCatCtrl = require('../controller/adminCategoryCtrl')
//admin controller 
const adminCtrl = require('../controller/adminCtrl')
//auth middleware
const { isAdminLogedIn } = require('../middleware/authMiddleware');



//get all categories
router.get('/', isAdminLogedIn, adminCatCtrl.getCategories)
//new category
router.get('/new-category', isAdminLogedIn, adminCatCtrl.newCategory)
router.post('/new-category', isAdminLogedIn, adminCatCtrl.createCategory)
//edit category
router.get('/edit-category/:id', isAdminLogedIn, adminCatCtrl.editCategory)
router.put('/edit-category/:id', isAdminLogedIn, adminCatCtrl.updateCategory)
//delete category
router.delete('/delete-category/:id', isAdminLogedIn, adminCatCtrl.deleteCategory)

module.exports = router;


