const jwt=require('jsonwebtoken')
const Admin=require('../models/adminModel')
const User=require('../models/userModel')
const mongoose = require('mongoose');
module.exports.isAdminLogedIn=(req,res,next)=>{
    let token=req.cookies.adminToken;
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,async(err,decodedToken)=>{
            if(err){
                res.redirect('/admin/admin-sign-in')
            }
            else{
                let admin=await Admin.findById(decodedToken.id)
                delete admin.admin_password
                res.locals.adminData = admin
                next();
            }
        })
    }
    else{
        res.redirect('/admin/admin-sign-in');
    }
}

module.exports.isUserLogedIn=(req,res,next)=>{
    let token=req.cookies.userToken;
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,async(err,decodedToken)=>{
            if(err){
                res.redirect('/login')
            }
            else{
                let userId=new mongoose.Types.ObjectId(decodedToken.id);
                let user=await User.findOne({_id:userId,user_status:true})
                if(user){
                delete user.user_password
                res.locals.userData = user
                next();
                }
                else{
                    req.flash('error','Access denied')
                    res.cookie('userToken','',{ maxAge:1})
                    res.redirect('/login');
                }
            }
        })
    }
    else{
        res.redirect('/login');
    }
}

module.exports.getUserData=(req,res,next)=>{
    let token=req.cookies.userToken;
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,async(err,decodedToken)=>{
            if(!err){
                let userId=new mongoose.Types.ObjectId(decodedToken.id);
                let user=await User.findOne({_id:userId,user_status:true})
                if(user){
                    delete user.user_password
                    res.locals.userData = user
                }
                else{
                    res.cookie('userToken','',{ maxAge:1})
                }
                
            }

        })
    }
    next();
}

