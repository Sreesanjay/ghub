//database connection
const mongoose=require('mongoose');
const dbConnect=async ()=>{
    
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(()=>console.log('Connected to db')).catch((e)=>{
        console.error(e)
    })
}
module.exports=dbConnect