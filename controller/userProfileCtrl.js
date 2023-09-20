const Category = require('../models/categoryModel')
const User = require('../models/userModel')
const mongoose = require('mongoose');
const OTP = require('../models/otpModel')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')

const getMyAccount=asyncHandler(async(req,res)=>{
    let user=await User.findById(res.locals.userData._id)
    let category = await Category.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'category',
                as: 'products',
                pipeline: [
                    {
                      $match: {
                        is_delete:false,
                        product_status:true
                      }
                    }
                  ]
            }
        },
    ])
    res.render('user/myAccount',{category,user,account:true})
})

const verifyOldPass=asyncHandler(async(req,res)=>{
  const user=await User.findById(res.locals.userData._id)
  if(user){
   const oldPass=req.body.old_pass;
   const user_password=user.user_password
    const auth=await bcrypt.compare(oldPass,user_password)
   if(auth){
      res.status(200).json({
        status:"success"
      })
   }else{
    console.log("Error")
      res.status(400).json({status:"error"})
   }
  }
})

const changePassword=asyncHandler(async(req,res) => {
  const salt = await bcrypt.genSalt(10)
  const user_password = await bcrypt.hash(req.body.user_password, salt)
  const newPass=await User.findByIdAndUpdate(res.locals.userData._id,{user_password})
  if(newPass){
    res.status(200).json({status:"success"})
  }
  else{
    throw new Error()
  }
})

//POST requset for edit profile
const editProfile=asyncHandler(async(req,res,next)=>{
  const checkOtp=await OTP.findOne({email:req.body.user_email})
  if(checkOtp){
    let cmp= await bcrypt.compare(req.body.otp,checkOtp.otp)
    delete req.body.otp
    if(cmp){
      const newUser=await User.findByIdAndUpdate(res.locals.userData._id,req.body,{new:true})
      console.log(newUser)
      if(newUser){
        res.status(200).json({status:'success'})
      }
      else{
        throw new Error()
      }
    }else{
      const error=new Error('Invalid OTP')
      error.statusCode = 400;
      throw error;
    }
  }
})

//GET request for user address
const getAllAddress=asyncHandler(async(req, res, next)=>{

})

//POST request for storing new address
const newAddress=asyncHandler(async(req, res, next)=>{
  console.log(req.body)
})


module.exports={
    getMyAccount,
    verifyOldPass,
    changePassword,
    editProfile,
    getAllAddress
}