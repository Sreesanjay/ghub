const Product=require('../models/productModel')
const Category=require('../models/categoryModel')
const fs=require('fs')
const path=require('path')

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
  console.log(req.body)
  // console.log("entered storeProduct ")
  // if (!req.files.prod_img_1||!req.files.prod_img_2) {
  //   res.json({success:false,err:"Wrong file format"})
  // }else{
  //   console.log(req.files)
  //   try{
  //     const img1=req.files.prod_img_1[0]
  //     const img2=[];
  //       req.files.prod_img_2.forEach((x)=>{
  //         img2.push({
  //           filename:x.filename,
  //           path:x.path
  //         })
  //       })

  //       let obj=({
  //           product_name:req.body.product_name,
  //           brand_name:req.body.brand_name,
  //           category:req.body.category,
  //           prod_price:req.body.prod_price,
  //           sellig_price:req.body.sellig_price,
  //           stock:req.body.stock,
  //           specification:req.body.specification,
  //           GST:req.body.GST,
  //           prod_img_1:{
  //             filename: img1.filename,
  //             path: img1.path,
  //           },
  //           prod_img_2:img2
       
  //       })
  //      let product=await Product.create(obj)
  //       if(product){
  //       req.flash('success','new product added successfully');
  //       res.json({success:true})
  //       }
  //       else{
  //           req.flash('error','Internal server error');
  //           res.ststus(400).json({success:false,err:"failed to create new prodect",serverError:true})
  //       }
  //   }catch(e){
  //       req.flash('error','Internal server error');
  //       res.status(500).json({success:false,serverError:true})
  //   }
  // }
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
  console.log(req.params.id)
  let productId = req.params.id;
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


module.exports={
    storeProduct,
    newProduct,
    getProducts,
    deleteProduct
}