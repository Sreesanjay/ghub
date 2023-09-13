const Product=require('../models/productModel')
const Category=require('../models/categoryModel')
const mongoose = require('mongoose'); 
// const upload =require('../middleware/multer');
const fs=require('fs')



const newProduct=async(req, res, next) => {
    try{
      
      let category=await Category.find({cat_status:true,is_delete:false},{cat_name:1})
      if(category.length>0){
        res.render('admin/newProduct', {admin:true,category,error:req.flash('error')[0]})
      }
      else{
        req.flash('error','No categories found')
        res.redirect('/admin/products')
      }
      
    }catch(err){
      console.log(err.message)
    }
   
}


const storeProduct=async(req,res,next)=>{
  console.log("err")
    try{
      const specification = JSON.parse(req.body.specification);
      const img2=[];
       const img1=[{
        filename:req.files.prod_img_1[0].filename,
        path:req.files.prod_img_1[0].path
       }] ;
       

        req.files.prod_img_2.forEach((x)=>{
          img2.push({
            filename:x.filename,
            path:x.path
          })
        })

        let obj=({
            product_name:req.body.product_name,
            brand_name:req.body.brand_name,
            category:req.body.category,
            prod_price:req.body.prod_price,
            sellig_price:req.body.sellig_price,
            stock:req.body.stock,
            specification:specification,
            GST:req.body.GST,
            prod_img_1:img1,
            prod_img_2:img2
       
        })
       let product=await Product.create(obj)
        if(product){
        req.flash('success','new product added successfully');
        res.json({success:true})
        }
        else{
            req.flash('error','Internal server error');
            res.ststus(400).json({success:false,err:"failed to create new prodect",serverError:true})
        }
    }catch(e){
        req.flash('error','Internal server error');
        res.status(500).json({success:false,serverError:true})   
    }
}
const getProducts=async (req, res, next)=>{
    try{
       let products=await Product.aggregate([
            {
              $match:{is_delete:false}
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
            {$project:{
                 _id:1,
                product_name:1,
                brand_name:1,
                prod_price:1,
                sellig_price:1,
                prod_img_1:1,
                stock:1,
                product_status:1,
                GST:1,
                createdAt:1,
                'category.cat_name':1 
            }}
          ])
        res.render('admin/product',{admin:true,products,success:req.flash('success')[0],error:req.flash('error')[0]})

    }catch(e){
     
    }
}
const deleteProduct=async(req, res) => {
  let productId =req.params.id
  console.log(productId)
  try{
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
      {is_delete:true},
      { new: true } // Return the updated category
    );
    if(updatedProduct){
      req.flash('success','product deleted successfully')
      res.json({success:true})
    }
    else{
      throw new Error()
    }
  }catch(e){
      req.flash('failed','failed to delete product')
      res.status(500).json({err:"Internal server error"})
  }
}
const viewProduct=async(req,res)=>{
  const productId=new mongoose.Types.ObjectId(req.params.id);
  try{
    let product=await Product.aggregate([
      {
        $match:{_id: productId}
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
     
     res.render('admin/viewProduct',{product,success:req.flash('success')[0],error:req.flash('error')[0]})

 }catch(e){
    req.flash('error',"internel server error")
    res.redirect('/admin/products')
 }
}
const getEditProduct=async(req, res, next)=>{
  try{
    const productId=new mongoose.Types.ObjectId(req.params.id);
    let product=await Product.aggregate([
      {
        $match:{_id: productId}
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
        $unwind:{path:"$category"}
      }
    ])
    let obj=product[0].category._id;
     let category=await Category.find({_id:{$nin:[obj]},is_delete:false,cat_status:true})
    if(product){
    res.render('admin/editProduct',{product:product[0],category,success:req.flash('success')[0],error:req.flash('error')[0]})
    }else{
      throw new Error() 
    }
  }catch(e){
    console.log("err")
    req.flash('error','internel server error')
    res.redirect('/admin/products')
  }
}
const editProduct=async(req,res)=>{
  console.log(req.body)
}

module.exports={
    storeProduct,
    newProduct,
    getProducts,
    deleteProduct,
    viewProduct,
    getEditProduct,
    editProduct
}