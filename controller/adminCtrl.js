const Admin=require('../models/adminModel')

const getDashboard = async(req,res)=>{
    res.render('admin/dashboard')
}
module.exports ={
    getDashboard
}