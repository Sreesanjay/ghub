const jwt=require('jsonwebtoken')
const Admin=require('../models/adminModel')
module.exports.isAdminLogedIn=(req,res,next)=>{
    let token=req.cookies.adminToken;
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,async(err,decodedToken)=>{
            if(err){
                res.redirect('/admin/admin-sign-in')
            }
            else{
                let admin=await Admin.findById(decodedToken.id)
                res.locals.adminData = admin
                next();
            }
        })
    }
    else{
        res.redirect('/admin/admin-sign-in');
    }
}
