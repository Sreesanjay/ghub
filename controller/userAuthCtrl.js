const User=require('../models/userModel')
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

//login
const getLoginPage=async(req, res)=>{
    let token=req.cookies.userToken;
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,async(err,decodedToken)=>{        
            if(err){
                res.render('user/loginPage',{success:req.flash('success')[0],error:req.flash('error')[0]})
            }
            else{
                
                res.redirect('/')
            }
        })
    }
    else{
    res.render('user/loginPage',{success:req.flash('success')[0],error:req.flash('error')[0]})
    }
}
const loginUser=async(req, res)=>{
        console.log("login post")
        const {user_email,user_password} = req.body
        try{
            let user=await User.login(user_email,user_password);
                const token=createToken(user._id)
                res.cookie("userToken",token,{httpOnly:true,maxAge:maxAge*1000})
                console.log("userToken created")
                res.status(200).json({
                    success:true,
                    user:user._id,
                    token:token
                })
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

const getSignUpPage=async(req, res)=>{
    res.render('user/signUpPage',{success:req.flash('success')[0],error:req.flash('error')[0]})
}
const genOtp=async(req, res) => {
     const  email=req.body.user_email
    const otp = otpgenerateOtp()
    const mailOptions = {
        from: 'sreesanjay7592sachu@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'Forgot Password?', // Subject line
        text:`your otp for account registration is ${otp}`
        };
        try{
        await OTP.updateOne(
            { email: email},
            { $set: { email: email,otp: otp} },
            { upsert: true })
            sendMail(mailOptions)
            res.json({status:"ok"})
        }
        catch(e) {
            res.status(500).json({err:"Internal server error",status:"error"})
        }
}

//register user
const registerUser=async(req,res)=>{
    console.log(req.body)
    try{
        let otpExist=await OTP.findOne({email:req.body.user_email,otp:req.body.otp})
        delete req.body.otp
        if(otpExist){
            console.log("otp got")
           let user=await User.findOne({user_email:req.body.user_email})
          
           if(user===null){
            console.log("User got")
            console.log(req.body)
           await User.create(req.body)
           req.flash('success','User registered successfully')
           res.json({status:true})
           }else{
           res.json({status:false, emailErr:"User already exists try another email address"})
           }
        }
        else{
            res.json({status:false, otpErr:"Wrong OTP"})
        }
    }catch(err) {
        console.log(err)
           req.flash('error','Internal server error')
           res.json({status:false})
    }
}
const logoutUser=async (req, res) => {
    res.cookie('userToken','',{ maxAge:1})
    res.redirect('/')
}

module.exports={
    getSignUpPage,
    getLoginPage,
    genOtp,
    logoutUser,
    registerUser,
    loginUser
}