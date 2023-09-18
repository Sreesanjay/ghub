const mongoose = require('mongoose'); 
const bcrypt=require('bcrypt')
var userSchema = new mongoose.Schema({
    user_name:{
        type:String,
        required:true,
    },
    user_email:{
        type:String,
        required:true,
        unique:true,
    },
    user_mobile:{
        type:String,
        required:true,
    },
    user_password:{
        type:String,
        required:true,
    },  
    user_wallet:{
        type:Number,
        required:true,
        default:0,
    },
    user_status:{
        type:Boolean,
        required:true,
        default:true
    }, 
    cart:[
        {
            product_id:{
                type:mongoose.Schema.Types.ObjectId,
                ref: 'Produts',
                },
            count:{
                type:Number,
                default:1
            }
        }
    ], 
    wishlist:[{
        product_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Produts',
            },
    }],
    is_delete:{
        type:Boolean,
        required:true,
        default:false
    } 
},{timestamps: true });
// hashing user password
userSchema.pre('save', async function(next){
    console.log("password hashed")
    const salt=await bcrypt.genSalt(10)
    this.user_password =await bcrypt.hash(this.user_password,salt)
    next()
    })
    
    //static functions for login and password
    userSchema.statics.login=async function(email, password){
        let user= await this.findOne({user_email:email,user_status:true})
        if(user){
            let auth=await bcrypt.compare(password,user.user_password)
            if(auth){
                return user;
            }
            else{
                throw Error('Incorrect password!')
            }
        }
        else{
            throw Error('User not found!')
        }
    }
//Export the model
module.exports = mongoose.model('User', userSchema);