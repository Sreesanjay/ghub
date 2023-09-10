const Admin=require('../models/adminModel')

const getDashboard = async(req,res)=>{
    const {_id,user_name,admin_email}=res.locals.adminData
    res.render('admin/dashboard',{admin:{user_name,id:_id,admin_email}})
}
module.exports ={
    getDashboard
}