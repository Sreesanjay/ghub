const User = require('../models/userModel')
const OTP = require('../models/otpModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { sendMail } = require('../config/nodeMailer')
const asyncHandler = require('express-async-handler')




const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: maxAge })
}
const otpgenerateOtp = () => {
    const otpLength = 6; // You can change this length as needed
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
        const randomDigit = Math.floor(Math.random() * 10)
        otp += randomDigit;
    }
    return otp.toString();
}

//login
const getLoginPage = asyncHandler(async (req, res) => {
    let token = req.cookies.userToken;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
            if (err) {
                res.render('user/loginPage', { success: req.flash('success')[0], error: req.flash('error')[0] })
            }
            else {

                res.redirect('/')
            }
        })
    }
    else {
        res.render('user/loginPage', { success: req.flash('success')[0], error: req.flash('error')[0] })
    }
})

//POST request for user login
const loginUser = asyncHandler(async (req, res) => {
    console.log("login post")
    const { user_email, user_password } = req.body
        let user = await User.login(user_email, user_password);
        const token = createToken(user._id)
        res.cookie("userToken", token, { httpOnly: true, maxAge: maxAge * 1000 })
        
        req.flash("success",'You have loged in successfully')
        res.status(200).json({
            status:'success',
            user: user._id,
            token: token
        })
})

const getSignUpPage = async (req, res) => {
    res.render('user/signUpPage', { success: req.flash('success')[0], error: req.flash('error')[0] })
}
const genOtp = asyncHandler(async (req, res) => {
    const email = req.body.user_email
    const userExsist = await User.findOne({ user_email: email })
    console.log(userExsist)
    if (userExsist) {
        const error = new Error('user already exsists')
        error.statusCode = 409
        throw error
    }
    else {
        let otp = otpgenerateOtp()
        const mailOptions = {
            from: 'sreesanjay7592sachu@gmail.com', // sender address
            to: email, // list of receivers
            subject: 'Registration to GHUB', // Subject line
            text: `your otp for email verification is ${otp}`
        };
        otp=await bcrypt.hash(otp,10)
        await OTP.updateOne(
            { email: email },
            { $set: { email: email, otp: otp } },
            { upsert: true })
        sendMail(mailOptions)
        res.json({ status: "success" })
    }
})

//register user
const registerUser = asyncHandler(async (req, res) => {
    let user = await OTP.findOne({ email: req.body.user_email})
    let otpExist=await bcrypt.compare(req.body.otp,user.otp)
    delete req.body.otp
    if (otpExist) {
        let user = await User.findOne({ user_email: req.body.user_email })

        if (user === null) {
            console.log(req.body)
            await User.create(req.body)
            res.json({ status: 'success' })
        } else {
            throw new Error()
        }
    }
    else {
        res.status(400).json({ status: 'Error', otpErr: "Wrong OTP" })
    }
})


const logoutUser = async (req, res) => {
    res.cookie('userToken', '', { maxAge: 1 })
    res.redirect('/')
}

module.exports = {
    getSignUpPage,
    getLoginPage,
    genOtp,
    logoutUser,
    registerUser,
    loginUser
}