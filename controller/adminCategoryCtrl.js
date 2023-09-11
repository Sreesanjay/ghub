const Admin=require('../models/adminModel')
const Category=require('../models/categoryModel')


const newCategory=async (req, res, next) => {
    const {_id,user_name,admin_email}=res.locals.adminData
  
    res.render('admin/newCategory',{admin:{user_name,admin_email,_id},success:req.flash('success')[0]})
}
const createCategory=async(req,res)=>{
    console.log("new category")
    try{
        const category = await Category.create(req.body)
        if(category){
        req.flash('success','new category added successfully');
        res.redirect('/admin/category')
        }
        else{
            req.flash('failed','failed to create new category');
            res.redirect('/admin/category/new-category')
        }
    }catch(e){
        res.status(500).json({err:"Internal server error",e})
    }
}
const getCategories=async(req,res)=>{
    try{
        let categories=await Category.find({is_delete:false})
        const {_id,user_name,admin_email}=res.locals.adminData
        res.render('admin/category',{admin:{_id,user_name,admin_email},categories,success:req.flash('success')[0]})
    }catch(e){
        res.status(500).json({err:"Internal server error"})
    }
}
const editCategory=async(req,res)=>{
    try{
        let category=await Category.findById(req.params.id)
        if(category){
        res.render('admin/editCategory',{admin:true,category})
        }
        else{
            res.status(400).json({err:"No category"})
        }
    }catch(e){
        res.status(500).json({err:"Internal server error",message:e.message})
    }
}
const updateCategory=async(req,res)=>{
    
    try{
       const categoryId=req.params.id
       const updateData=req.body.obj
       delete updateData.id
       console.log("edit category")
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            updateData,
            { new: true } // Return the updated category
          );
          if(updatedCategory){
            req.flash('success','category updated succesfully')
            res.json({success:true,category:updatedCategory})
          }
          else{
            res.status(400).json({err:"Failed to update category"})
          }
       
    }catch(e){
        res.status(500).json({err:"Internal server error"})
    }
}
//delete category
const deleteCategory=async(req,res) => {
    let categoryId = req.params.id;
    try{
    const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        {is_delete:true},
        { new: true } // Return the updated category
      );
      if(updatedCategory){
        req.flash('success','category deleted successfully')
        res.json({success:true})
      }
      else{
        throw new Error()
      }
    }catch(e){
        req.flash('failed','failed to delete category')
        resstatus(500).json({err:"Internal server error"})
    }
    }




module.exports={
getCategories,
createCategory,
editCategory,
updateCategory,
newCategory,
deleteCategory,
}