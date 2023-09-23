const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const mongoose = require('mongoose');
const fs = require('fs')
const asyncHandler = require('express-async-handler')



//GET request for new product page
const newProduct = asyncHandler(async (req, res, next) => {
  let category = await Category.find({ cat_status: true, is_delete: false }, { cat_name: 1 })
  if (category.length > 0) {
    res.render('admin/newProduct', { admin: true, category, error: req.flash('error')[0] })
  }
  else {
    req.flash('error', 'No categories found')
    res.redirect('/admin/products')
  }
})

//POST requset for storing product
const storeProduct = asyncHandler(async (req, res, next) => {
  const specification = JSON.parse(req.body.specification);
  const img2 = [];
  const img1 = {
    filename: req.files.primary_img[0].filename,
    path: req.files.primary_img[0].path,
    originalname: req.files.primary_img[0].originalname
  };
  if (req.files.secondary_img) {
    req.files.secondary_img.forEach((x) => {
      img2.push({
        filename: x.filename,
        path: x.path,
        originalname: x.originalname
      })
    })
}

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
    primary_img: img1,
    secondary_img: img2

  })
  let product = await Product.create(obj)
  if (product) {
    res.json({ success: true })
  }
  else {
    next(new Error("Sorry! Can't upload product"))
  }
})


//GET request for all products 
const getProducts = asyncHandler(async (req, res, next) => {
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
        primary_img: 1,
        stock: 1,
        product_status: 1,
        GST: 1,
        createdAt: 1,
        'category.cat_name': 1
      }
    }
  ])
  res.render('admin/product', { admin: true, products, success: req.flash('success')[0], error: req.flash('error')[0] })
})


//request for delete product
const deleteProduct =asyncHandler(async (req, res) => {
  let productId = req.params.id
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { is_delete: true },
      { new: true } // Return the updated category
    );
    if (updatedProduct) {
      res.json({ status: 'success' })
    }
    else {
      const error = new Error("Can't delete product!");
      throw new Error(error)
    }
})

//request for view product details page
const viewProduct = asyncHandler(async (req, res) => {
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
      }
    ])

    res.render('admin/viewProduct', { product, success: req.flash('success')[0], error: req.flash('error')[0] })
})

//render product edit page
const getEditProduct =asyncHandler(async (req, res, next) => {
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
})

const editProduct = asyncHandler(async (req, res) => {
  let changeProdImg = JSON.parse(req.body.changeProdImg)
  let productId = req.params.id
  delete req.body.changeProdImg

  let specification = []
  let spec = req.body.spec;
  let val = req.body.val;
  let newProduct;

  if (Array.isArray(spec)) {
    for (let i = 0; i < spec.length; i++) {
      specification.push({
        spec: spec[i],
        val: val[i]
      })
    }
    req.body.specification = specification;
  } else if (spec) {
    specification.push({
      spec,
      val
    })
    req.body.specification = specification;
  }



  if (req.files.primary_img) {
    const primary_img = {
      originalname: req.files.primary_img[0].originalname,
      filename: req.files.primary_img[0].filename,
      path: req.files.primary_img[0].path,

    }
    req.body.primary_img = primary_img
  }
  await Product.findByIdAndUpdate(productId, req.body)

  if (changeProdImg.length > 0) {
    await Product.findByIdAndUpdate(
      productId,
      {
        $pull: {
          secondary_img: {
            _id: { $in: changeProdImg.map(id => new mongoose.Types.ObjectId(id)) }
          }
        }
      })
  }


  if (req.files.secondary_img) {
    req.files.secondary_img.map((img) => {
      delete img.fieldname
      delete img.encoding
      delete img.mimetype
      delete img.destination
      delete img.size
    })
    const secondaryimg = req.files.secondary_img


    newProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $push: {
          secondary_img: {
            $each: secondaryimg
          }
        }
      },
      { new: true }
    );
  }
  res.status(200).json({ success: true })

})

module.exports = {
  storeProduct,
  newProduct,
  getProducts,
  deleteProduct,
  viewProduct,
  getEditProduct,
  editProduct
}