const Admin=require('../models/adminModel')
const OTP=require('../models/otpModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const{sendMail} =require('../config/nodeMailer')
const maxAge=3 * 24 * 60 * 60;
const createToken=(id)=>{
        return jwt.sign({id},process.env.SECRET_KEY,{expiresIn:maxAge})
}
const otpgenerateOtp=()=>{
    const otpLength = 6; // You can change this length as needed
    let otp = '';
   for (let i = 0; i < otpLength; i++) {
    const randomDigit = Math.floor(Math.random() * 10)
    otp += randomDigit;
   }
    return otp.toString();
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
    let token=req.cookies.adminToken;
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,async(err,decodedToken)=>{
            
            if(err){
                res.render('admin/loginPage',{admin:true})
            }
            else{
                
                res.redirect('/admin')
            }
        })
    }
    else{
        res.render('admin/loginPage',{admin:true,success:req.flash('success')[0]})
    }
}
//post req for admin login
const adminlogin=async (req,res)=>{
    console.log("login post")
    const {admin_email,admin_password} = req.body
    try{
        let admin=await Admin.login(admin_email,admin_password);
        if(admin){
            const token=createToken(admin._id)
            res.cookie("adminToken",token,{httpOnly:true,maxAge:maxAge*1000})
            console.log("adminToken created")
            res.status(200).json({
                success:true,
                admin:admin._id,
                token:token
            })
        }
    }catch(err){
       if(err.message=='Incorrect password!'){
            res.json({
            success:false,
            pass: err.message
             })
         }
         else{
            res.json({
                success:false,
                email: err.message
                 })
         }
    }
}
const forgotPassword=(req,res)=>{
    res.render('admin/forgotPAssVerifier',{admin:true,error:req.flash('error')})
}
const getOtpForgotPass=async(req, res)=>{
    const admin_email = req.body.admin_email;
    let admin=await Admin.findOne({admin_email:admin_email});
    if(admin){
        const otp = otpgenerateOtp()
        const mailOptions = {
            from: 'sreesanjay7592sachu@gmail.com', // sender address
            to: 'sreesanjaych@gmail.com', // list of receivers
            subject: 'Forgot Password?', // Subject line
            text:`your otp for password reset is ${otp}`
            };
            try{
            await OTP.updateOne(
                { email: admin_email},
                { $set: { email: admin_email,otp: otp} },
                { upsert: true })
            sendMail(mailOptions)
            res.status(200).json({
                success:true,
                admin_email:admin_email,
            })
            }catch(err){
                res.status(500).json({success:false,err:"sorry! Something went wrong,try again"})
            }
    }else{
        console.log("user not found")
        res.json({
            success:false,
            err:"email is not valid"
        })
    }
    
}
const verifyOtp=async(req,res)=>{
    console.log("verifyOtp")
    const {admin_email,admin_otp} = req.body;
    let otp=await OTP.findOne({email:admin_email,otp:admin_otp})
    if(otp){
        req.session.passResetMail=admin_email;
        res.json({
            success:true,
            admin_email
        })
    }
    else{
        res.json({
            success:false,
            err:"enter a valid OTP"
        })
    }

}
const resetPassword=async (req,res)=>{
   res.render('admin/passReset',{admin:true})
}
const updatePassword=async(req,res)=>{
    let admin=await Admin.findOne({admin_email:req.session.passResetMail});
    admin.admin_password=req.body.admin_password;
    delete req.session.passResetMail;
    try{
    admin.save();
    req.flash('success','Password reset successful')
    res.redirect('/admin')
    }
    catch(err){
        req.flash('error','Password reset failed')
        res.redirect('/admin/forgot-password')
    }

   
  
}
const signOut=async(req,res)=>{
    req.cookies
}
module.exports ={
    adminSignUp,
    adminLoginPage,
    adminlogin,
    getOtpForgotPass,
    signOut,
    forgotPassword,
    verifyOtp,
    resetPassword,
    updatePassword
}