const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const mongoose = require('mongoose');
// const upload =require('../middleware/multer');
const fs = require('fs')



const newProduct = async (req, res, next) => {
  try {

    let category = await Category.find({ cat_status: true, is_delete: false }, { cat_name: 1 })
    if (category.length > 0) {
      res.render('admin/newProduct', { admin: true, category, error: req.flash('error')[0] })
    }
    else {
      req.flash('error', 'No categories found')
      res.redirect('/admin/products')
    }

  } catch (err) {
    console.log(err.message)
  }

}


const storeProduct = async (req, res, next) => {
  try {
    const specification = JSON.parse(req.body.specification);
    const img2 = [];
    const img1 = [{
      filename: req.files.prod_img_1[0].filename,
      path: req.files.prod_img_1[0].path,
      originalname: req.files.prod_img_1[0].originalname
    }];


    req.files.prod_img_2.forEach((x) => {
      img2.push({
        filename: x.filename,
        path: x.path,
        originalname: x.originalname
      })
    })

    let obj = ({
      product_name: req.body.product_name,
      brand_name: req.body.brand_name,
      category: req.body.category,
      discription: req.body.discription,
      prod_price: req.body.prod_price,
      sellig_price: req.body.sellig_price,
      stock: req.body.stock,
      specification: specification,
      GST: req.body.GST,
      prod_img_1: img1,
      prod_img_2: img2

    })
    console.log(obj)
    let product = await Product.create(obj)
    if (product) {
      req.flash('success', 'new product added successfully');
      res.json({ success: true })
    }
    else {
      req.flash('error', 'Internal server error');
      res.ststus(400).json({ success: false, err: "failed to create new prodect", serverError: true })
    }
  } catch (e) {
    console.log(e)
    req.flash('error', 'Internal server error');
    res.status(500).json({ success: false, serverError: true })
  }
}
const getProducts = async (req, res, next) => {
  try {
    let products = await Product.aggregate([
      {
        $match: { is_delete: false }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $match: {
          'category.cat_status': true,
          'category.is_delete': false
        },
      },
      {
        $project: {
          _id: 1,
          product_name: 1,
          brand_name: 1,
          prod_price: 1,
          sellig_price: 1,
          prod_img_1: 1,
          stock: 1,
          product_status: 1,
          GST: 1,
          createdAt: 1,
          'category.cat_name': 1
        }
      }
    ])
    res.render('admin/product', { admin: true, products, success: req.flash('success')[0], error: req.flash('error')[0] })

  } catch (e) {
    req.flash('failed', 'failed to fetch products')
    res.redirect('/admin')
  }
}
const deleteProduct = async (req, res) => {
  let productId = req.params.id
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { is_delete: true },
      { new: true } // Return the updated category
    );
    if (updatedProduct) {
      req.flash('success', 'product deleted successfully')
      res.json({ success: true })
    }
    else {
      throw new Error()
    }
  } catch (e) {
    req.flash('error', 'failed to delete product')
    res.status(500).json({ err: "Internal server error" })
  }
}
const viewProduct = async (req, res) => {
  const productId = new mongoose.Types.ObjectId(req.params.id);
  try {
    let product = await Product.aggregate([
      {
        $match: { _id: productId }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      }
    ])

    res.render('admin/viewProduct', { product, success: req.flash('success')[0], error: req.flash('error')[0] })

  } catch (e) {
    req.flash('error', "internel server error")
    res.redirect('/admin/products')
  }
}
const getEditProduct = async (req, res, next) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.id);
    let product = await Product.aggregate([
      {
        $match: { _id: productId }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: { path: "$category" }
      }
    ])
    let obj = product[0].category._id;
    let category = await Category.find({ _id: { $nin: [obj] }, is_delete: false, cat_status: true })
    if (product) {
      res.render('admin/editProduct', { product: product[0], category, success: req.flash('success')[0], error: req.flash('error')[0] })
    } else {
      throw new Error()
    }
  } catch (e) {
    console.log("err")
    req.flash('error', 'internel server error')
    res.redirect('/admin/products')
  }
}
const editProduct = async (req, res) => {
  try{
  const productId = new mongoose.Types.ObjectId(req.params.id)
  let specification = []
  let spec = req.body.spec;
  let val = req.body.val;
  let changeProdImg = JSON.parse(req.body.changeProdImg)
  delete req.body.changeProdImg;
  delete req.body.spec
  delete req.body.val
  let product = await Product.findById(productId)
  if(spec){
  for (let i = 0; i < spec.length; i++) {
    specification.push({
      spec: spec[i],
      val: val[i]
    })
  }
  req.body.specification = specification
}

  if (req.files.prod_img_1) {
    product.prod_img_1[0].filename= req.files.prod_img_1[0].filename,
    product.prod_img_1[0].path= req.files.prod_img_1[0].path,
    product.prod_img_1[0].originalname= req.files.prod_img_1[0].originalname

  }

  if (req.files.prod_img_2) {
    req.files.prod_img_2.map((img)=>{
      for(let i=0; i<changeProdImg.length;i++){
      if(changeProdImg[i].path=='prod_img_2'){
        for(let j=0;j<product.prod_img_2.length;j++){
          if(changeProdImg[i].id==product.prod_img_2[j]._id.toString()){
            product.prod_img_2[j].filename=img.filename;
            product.prod_img_2[j].path=img.path;
            product.prod_img_2[j].originalname=img.originalname;
            changeProdImg.splice(i,1)
            break;
          }
        }
        
      }  
      }
    })
  }
  product.product_name= req.body.product_name
  product.brand_name=req.body.brand_name
  product.category= req.body.category
  product.discription= req.body.discription
  product.prod_price= req.body.prod_price
  product.sellig_price= req.body.sellig_price
  product.stock= req.body.stock
  product.specification= specification
  product.product_status=req.body.product_status
  product.GST= req.body.GST
  let newProduct=await Product.findByIdAndUpdate(productId,product,{new:true});
  if(newProduct){
    req.flash('success','Product updated successfully')
  res.status(200).json("ok")
  }
  else{
    throw new Error()
  }
}catch(err){
  req.flash('error', 'Internal server error');
  res.status(500).json({ success: false, serverError: true })
}

}

module.exports = {
  storeProduct,
  newProduct,
  getProducts,
  deleteProduct,
  viewProduct,
  getEditProduct,
  editProduct
}