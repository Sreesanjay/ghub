const Product=require('../models/productModel')
const Category=require('../models/categoryModel')


const newProduct=async(req, res, next) => {
    try{
      let category=await Category.find({cat_status:true,is_delete:false},{cat_name:1})
      console.log(category)
      if(category.length>0){
        res.render('admin/newProduct', {admin:true,category})
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
    console.log("new product")
    try{
        const product = await Product.create(req.body)
        if(product){
        // req.flash('success','new product added successfully');
        // res.redirect('/admin/category')
        res.json({success:true,product})
        }
        else{
            // req.flash('failed','failed to create new category');
            // res.redirect('/admin/category/new-category')
            res.json({success:false,err:"failed"})
        }
    }catch(e){
        res.status(500).json({err:"Internal server error",e})
    }
}
const getProducts=async (req, res, next)=>{
    try{
       let products=await Product.aggregate([
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
                product_name:1,
                brand_name:1,
                prod_price:1,
                sellig_price:1,
                stock:1,
                product_status:1,
                GST:1,
                createdAt:1,
                'category.cat_name':1 
            }}
          ])
    if(products){

        res.render('admin/product',{admin:true,products,success:req.flash('success')[0],error:req.flash('error')[0]})
    }

    }catch(e){
        console.log(e)
    }
}

module.exports={
    storeProduct,
    newProduct,
    getProducts
}