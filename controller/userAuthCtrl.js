const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../config/nodeMailer");
const asyncHandler = require("express-async-handler");
const crypto = require('crypto');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
     return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: maxAge });
};
//otp generator
const otpgenerateOtp = () => {
     const otpLength = 6; // You can change this length as needed
     let otp = "";
     for (let i = 0; i < otpLength; i++) {
          const randomDigit = Math.floor(Math.random() * 10);
          otp += randomDigit;
     }
     return otp.toString();
};
//referal code generator
const genReferalCode = (body) => {
     const currentDate = new Date().toISOString();
     const dataToHash = body.user_email + body.user_mobile + currentDate;
     // Create an SHA-256 hash of the concatenated data
     const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
     // Use the first 8 characters of the hash as the referral code
     const referralCode = hash.substring(0, 8);
     return referralCode;
}
//login
const getLoginPage = asyncHandler(async (req, res) => {
     const token = req.cookies.userToken;
     if (token) {
          jwt.verify(
               token,
               process.env.SECRET_KEY,
               async (err, decodedToken) => {
                    if (err) {
                         res.render("user/loginPage", {
                              success: req.flash("success")[0],
                              error: req.flash("error")[0],
                         });
                    } else {
                         res.redirect("/");
                    }
               }
          );
     } else {
          res.render("user/loginPage", {
               success: req.flash("success")[0],
               error: req.flash("error")[0],
          });
     }
});

//POST request for user login
const loginUser = asyncHandler(async (req, res) => {
     const { user_email, user_password } = req.body;
     let user = await User.login(user_email, user_password);
     const token = createToken(user._id);
     res.cookie("userToken", token, { httpOnly: true, maxAge: maxAge * 1000 });

     req.flash("success", "You have loged in successfully");
     res.status(200).json({
          status: "success",
          user: user._id,
          token: token,
     });
});

const getSignUpPage = async (req, res) => {
     res.render("user/signUpPage", {
          success: req.flash("success")[0],
          error: req.flash("error")[0],
     });
};
const genOtp = asyncHandler(async (req, res) => {
     const email = req.body.user_email;
     const userExsist = await User.findOne({ user_email: email });
     if (userExsist) {
          const error = new Error("user already exsists");
          error.statusCode = 409;
          throw error;
     } else {
          let otp = otpgenerateOtp();
          const mailOptions = {
               from: "sreesanjay7592sachu@gmail.com", // sender address
               to: email, // list of receivers
               subject: "Registration to GHUB", // Subject line
               text: `your otp for email verification is ${otp}`,
          };
          otp = await bcrypt.hash(otp, 10);
          await OTP.updateOne(
               { email: email },
               { $set: { email: email, otp: otp } },
               { upsert: true }
          );
          sendMail(mailOptions);
          res.json({ status: "success" });
     }
});

//register user
const registerUser = asyncHandler(async (req, res) => {
     console.log(req.body)
     let user = await OTP.findOne({ email: req.body.user_email });
     const otpExist = await bcrypt.compare(req.body.otp, user.otp);
     delete req.body.otp;
     if (otpExist) {
          let user = await User.findOne({ user_email: req.body.user_email });
          if (user === null) {
               const salt = await bcrypt.genSalt(10);
               req.body.user_password = await bcrypt.hash(req.body.user_password, salt);
               req.body.referral_code = genReferalCode(req.body) //generating user's unique referal code
               if (req.body.referred_by) {
                    let referredBy = await User.findOne({ referral_code: req.body.referred_by });
                    console.log(referredBy)
                    if (referredBy) {
                         referredBy.user_wallet = referredBy.user_wallet + 50;
                         referredBy.save()
                         req.body.referred_by = referredBy._id

                         const mailOptions = {
                              from: "sreesanjay7592sachu@gmail.com", // sender address
                              to: referredBy.user_email, // list of receivers
                              subject: " Congratulations on Earning 50 Rupees on GHub!", // Subject line
                              html: `<html>
                                        <body>
                                             <p>Dear ${referredBy.user_name},</p>
                                             <p>We are thrilled to inform you that you have earned 50 Rupees through our referral program on GHub! 🎉</p>
                                             <p>Your dedication and support in referring new users to our platform have been outstanding. Your efforts have not only benefited you but have also contributed to the growth of our GHub community.</p>
                                             <p>Here are a few details about your referral earnings:</p>
                                             <ul>
                                                  <li>Earnings: 50 Rupees</li>
                                                  <li>Referral Program: You referred new users to GHub, and when they signed up, you earned rewards.</li>
                                             </ul>
                                             <p>We want to express our gratitude for your active participation. Keep spreading the word about GHub, and you'll continue to earn rewards.</p>
                                             <p>If you have any questions or need assistance with anything related to your account or referrals, please don't hesitate to reach out to our support team.</p>
                                             <p>Thank you for being a valuable member of the GHub community. We look forward to more exciting milestones together!</p>
                                             <p>Best regards,<br>The GHub Team</p>
                                        </body>
                                   </html>`,
                         };
                         sendMail(mailOptions)

                         await User.create(req.body);
                         res.json({ status: "success" });
                    } else {
                         res.status(400).json({
                              status: "Error",
                              referalErr: 'Wrong referral code'
                         })
                    }
               } else {
                    await User.create(req.body);
                    res.json({ status: "success" });
               }

          } else {
               throw new Error();
          }
     } else {
          res.status(400).json({ status: "Error", otpErr: "Wrong OTP" });
     }
});

const logoutUser = async (req, res) => {
     res.cookie("userToken", "", { maxAge: 1 });
     res.redirect("/");
};

module.exports = {
     getSignUpPage,
     getLoginPage,
     genOtp,
     logoutUser,
     registerUser,
     loginUser,
};
