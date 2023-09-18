const mongoose = require('mongoose');
const User=require('../models/userModel')
const getCustomer=async(req, res, next)=>{
    try{
        const userList=await User.find()
        res.render('admin/userList',{userList,success:req.flash('success')[0],error:req.flash('error')[0]})
    }catch(err){
        next(err)
    }
}
const blockCustomer=async(req, res, next)=>{
    try{
        const customer=await User.findByIdAndUpdate({_id:req.params.id},{user_status:false})
        if(customer){
            req.flash('success','blocked customer successfully')
            res.redirect('/admin/customers')
        }
        else{
            req.flash('error','Failed to block User')
            res.status(400)
            res.redirect('/admin/customers')
        }
    }catch(err) {
        next(err)
    }
}

//unblock customer
const unblockCustomer=async(req, res, next)=>{
    try{
        const customer=await User.findByIdAndUpdate({_id:req.params.id},{user_status:true})
        if(customer){
            req.flash('success','unblocked customer successfully')
            res.redirect('/admin/customers')
        }
        else{
            req.flash('error','Failed to unblock User')
            res.status(400)
            res.redirect('/admin/customers')
        }
    }catch(err) {
        next(err)
    }
}
module.exports={
getCustomer,
blockCustomer,
unblockCustomer
}