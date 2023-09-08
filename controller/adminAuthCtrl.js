const Admin=require('../models/adminModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const maxAge=3 * 24 * 60 * 60;
const createToken=(id)=>{
        return jwt.sign({id},process.env.SECRET_KEY,{expiresIn:maxAge})
}

//admin signup
const adminSignUp=async(req,res)=>{
    let email = req.body.admin_email
    // checking admin exist or not
    let checkAdmin=await Admin.findOne({admin_email: email})
    if (!checkAdmin) {
        try {
            const admin = await Admin.create(req.body)
            res.json({
                success: true,
                admin
            })
        }catch (err) {
            res.status(400).json({message:false,err:err.message})
        }
    }
    else{
        res.json({
            msg:"user already exists",
            success:false
        })
    }
}
//get req for admin page
const adminLoginPage=async (req,res)=>{
    res.json({success:true,message:"login page"})
    // res.render('admin/loginPage')
}
//post req for admin login
const adminlogin=async (req,res)=>{
    const {admin_email,admin_password} = req.body
    try{
        let admin=await Admin.login(admin_email,admin_password);
        if(admin){
            const token=createToken(admin._id)
            // res.cookie("adminToken",token,{httpOnly:true,maxAge:maxAge*1000})
            res.status(200).json({
                success:true,
                admin:admin._id,
                token:token
            })
        }
    }catch(err){
        res.status(400).json({
            success:false,
           err: err.message
        })
    }
}
module.exports ={
    adminSignUp,
    adminLoginPage,
    adminlogin
}