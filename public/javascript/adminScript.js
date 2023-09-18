$(document).ready(function () {
//admin login form submit

$('#admin-login-form').on('submit', (async function(e) {
    e.preventDefault();
const adminLoginForm=document.querySelector('.admin-login-form');
const passErr=document.querySelector('.passErr')
const mailErr=document.querySelector('.mailErr')
    passErr.textContent =''
    mailErr.textContent =''
    const admin_email=adminLoginForm.admin_email.value;
    const admin_password=adminLoginForm.admin_password.value;
    console.log(admin_email,admin_password);
    try{
        let res=await fetch('/admin/admin-sign-in',{
            method:'POST',
            body: JSON.stringify({admin_email,admin_password}),
            headers: {'Content-Type': 'application/json'}
        })
        let data = await res.json()
        if(data.pass){
            console.log("password err")
            passErr.textContent=data.pass
        }
        if(data.email){
            console.log("user error")
            mailErr.textContent=data.email
        }
        if(data.admin){
            console.log("loge in")
            location.assign('/admin')
        }
    }catch(err){
        
    }
}))
$('#email-verify-btn').on('click',async()=>{
    let admin_email=document.querySelector('.admin-email').value
    let emailErr=document.querySelector('.emailErr')
    let otpErr=document.querySelector('.otpErr')
    if(admin_email){
        otpErr.textContent =''
        emailErr.textContent =''
        try{
            let res=await fetch('/admin/forgot-password/verify-mail',{
                method:'POST',
                body: JSON.stringify({admin_email}),
                headers: {'Content-Type': 'application/json'}
            })
            let data = await res.json()
            if(data.success){
               let otpWraper= document.getElementById('otp-wraper')
               let emailVerifyBtn=document.getElementById('email-verify-btn')
               let user=document.querySelector('.email-span')
               user.textContent=data.admin_email
               emailVerifyBtn.style.display='none'
               otpWraper.style.display='block'
            }
            console.log(data)
            if(data.err){
                emailErr.textContent=data.err
            }
        }catch(err){
            
        }
    }
    else{
        emailErr.textContent="Email is required"
    }
})

$('#otp-verify-btn').on('click',async()=>{
    let admin_email=document.querySelector('.admin-email').value
    let admin_otp=document.querySelector('.admin-otp').value
    let otpErr=document.querySelector('.otpErr')
    if(admin_otp.length>5){
        otpErr.textContent =''
        try{
            let res=await fetch('/admin/forgot-password/verify-otp',{
                method:'POST',
                body: JSON.stringify({admin_email,admin_otp}),
                headers: {'Content-Type': 'application/json'}
            })
            const data=await res.json();
            console.log(data)
            if(data.success){
               location.assign('/admin/forgot-password/reset-password')
            }
            if(data.err){
                otpErr.textContent=data.err
            }
            
        }catch(err){ 
              console.log(err)
        }
    }
    else{
       otpErr.textContent="Enter a valid  otp"
    }
})
//creating new admin password
$('#admin-newpass').validate({
    rules:{
        admin_password:{
            required:true,
            minlength:5,
        },
        confirm_password:{
            required:true,
            minlength:5,
            equalTo: "#admin_password"
        }
    },
    messages : {
      required: "This field is requied",
    }
 });
});