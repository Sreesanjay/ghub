const mongoose = require('mongoose');
const User=require('../models/userModel')
const asyncHandler = require('express-async-handler')


//GET request for getting customer list page
const getCustomers=asyncHandler(async(req, res, next)=>{
        let userList=await User.find()
        userList = userList.map(user => {
            return {
              ...user.toObject(),
              createdAt: new Date(user.createdAt).toLocaleDateString(), 
            };
          });
        res.render('admin/userList',{userList})
})

//GET request for blocking customerr
const blockCustomer=asyncHandler(async(req, res, next)=>{
        const customer=await User.findByIdAndUpdate({_id:req.params.id},{user_status:false})
        if(customer){
            res.redirect('/admin/customers')
        }
        else{
            const error = new Error('Failed to block customer')
            error.statusCode=500;
            throw error
        }
})

//unblock customer
const unblockCustomer=asyncHandler(async(req, res, next)=>{
        const customer=await User.findByIdAndUpdate({_id:req.params.id},{user_status:true})
        if(customer){
            res.redirect('/admin/customers')
        }
        else{
            const error = new Error('Failed to block customer')
            error.statusCode=500;
            throw error
        }
})
module.exports={
getCustomers,
blockCustomer,
unblockCustomer
}