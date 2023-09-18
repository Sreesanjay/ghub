

$(document).ready(function () {
   expandCat = () => {
      const showmore = document.getElementById('showmore');
      const showless = document.getElementById('showless');
      const catList = document.querySelector('.category-selector')
      catList.style.height = "100%";
      showmore.style.display = "none"
      showless.style.display = "block"
   }
   reduceCat = () => {
      const showmore = document.getElementById('showmore');
      const showless = document.getElementById('showless');
      const catList = document.querySelector('.category-selector')
      catList.style.height = "60px";
      showmore.style.display = "block"
      showless.style.display = "none"
   }

   toggleProfile = () => {
      $('#profile-crad').toggle()
      $('.carousel-control-next').toggle()
   }


   // $('#signup-form').validate({
   //    rules:{
   //       user_name:{
   //          required:true,
   //        },
   //        user_email:{
   //            required:true,
   //        },
   //        user_password:{
   //            required:true,
   //            minlength:5
   //        },
   //        user_mobile:{
   //          required:true,
   //          minlength:10,
   //          maxlength:10
   //        },
   //        repeat_pass: {
   //          required: true,
   //          minlength: 5,
   //          equalTo: "#password"
   //      }
   //    },
   //    messages : {
   //      required: "This field is requied",
   //      maxlength: "Your custom range length message goes here."
   //    }
   // });
   $('.getUserOtp').on('click', (async function (e) {
      e.preventDefault()
      let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
      let emailErr = document.querySelector('.email-err')
      let userErr = document.querySelector('.user-err')
      let passErr = document.querySelector('.pass-err')
      let repErr = document.querySelector('.rep-err')
      let mobErr = document.querySelector('.mob-err')
      emailErr.innerText = ''
      userErr.innerText = ''
      passErr.innerText = ''
      repErr.innerText = ''
      mobErr.innerText = ''
      let user_name = document.getElementById('signup-user-name')
      let user_email = document.getElementById('signup-user-email')
      let user_mobile = document.getElementById('signup-user-mobile')
      let user_password = document.getElementById('signup-user-pass')
      let rep_pass = document.getElementById('signup-user-rep-pass')
      switch (true) {
         case user_name.value === '': userErr.innerText = 'Please enter your username'
            break;
         case user_email.value === '': emailErr.innerText = 'please enter your email'
            break;
         case regex.test(user_email.value) === false: emailErr.innerText = 'please enter a proper email address'
            break;
         case user_mobile.value === '': mobErr.innerText = 'please enter your phone number'
            break;
         case user_mobile.value.toString().length !== 10: mobErr.innerText = 'phone numer should be 10 digits'
            break;
         case user_password.value === '': passErr.innerText = 'please enter your password'
            break;
         case user_password.value.length < 5: passErr.innerText = 'password should contain at least 5 characters'
            break;
         case rep_pass.value !== user_password.value: repErr.innerText = 'both password shoulb be same'
            break;
         default:
            const otpsection = document.querySelector('.signup-otpsection')
            document.querySelector('.getUserOtp').style.display = "none"
            otpsection.style.display = 'block';
            user_name.disabled = true
            user_email.disabled = true
            user_mobile.disabled = true
            user_password.disabled = true
            rep_pass.disabled = true


            try {
               await fetch('/get-signup-otp', {
                  method: 'POST',
                  body: JSON.stringify({ user_email: user_email.value }),
                  headers: { 'Content-Type': 'application/json' }
               })
            } catch (err) {
               console.log("internal server error")
            }
      }
   }))

   $('#signup-form').on('submit', async (e) => {
      e.preventDefault()
      let user_name = document.getElementById('signup-user-name').value
      let user_email = document.getElementById('signup-user-email').value
      let user_mobile = document.getElementById('signup-user-mobile').value
      let user_password = document.getElementById('signup-user-pass').value
      let otp = document.getElementById('user-otp').value
      let emailErr = document.querySelector('.email-err')
      let otpErr = document.querySelector('.otpErr')
      try {
         const formData = new FormData()
         formData.append('user_name', user_name)
         formData.append('user_email', user_email)
         formData.append('user_mobile', user_mobile)
         formData.append('user_password', user_password)
         formData.append('otp', otp)
         const obj = Object.fromEntries(formData);
         console.log(obj)
         const res = await fetch('/user-sign-up', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: { 'Content-Type': 'application/json' }
         })
         const data = await res.json()
         if (data.status) {
            location.assign('/login')
         } else {
            if (data.emailErr) {
               emailErr.innerText = data.emailErr
               document.querySelector('.signup-otpsection').style.display = "none"
               document.querySelector('.getUserOtp').style.display = "block"
               let user_name = document.getElementById('signup-user-name')
               let user_email = document.getElementById('signup-user-email')
               let user_mobile = document.getElementById('signup-user-mobile')
               let user_password = document.getElementById('signup-user-pass')
               let rep_pass = document.getElementById('signup-user-rep-pass')
               document.getElementById('user-otp').value = ''
               user_name.disabled = false
               user_email.disabled = false
               user_mobile.disabled = false
               user_password.disabled = false
               rep_pass.disabled = false
            }
            else if (data.otpErr) {
               otpErr.innerText = data.otpErr
            }
            else {
               location.assign('/sign-up')
            }
         }
      } catch (err) {
         console.log(err)
      }
   })

   //user login
   $('#user-loginForm').on('submit',async(e)=>{
      e.preventDefault()
      let emailErr=document.querySelector('.emailErr')
      let passErr=document.querySelector('.passErr')
      emailErr.innerText =''
      passErr.innerText =''
      let form = document.getElementById('user-loginForm')
      const formData=  new FormData(form)
      const email = formData.get("user_email");
      const password = formData.get("user_password")
      if(!email){
         emailErr.innerText='Email is required'
      }
      else if(!password){
         passErr.innerText='Password is required'
      }
      else{
         try{
            const obj = Object.fromEntries(formData);
            const res = await fetch('/user-log-in', {
               method: 'POST',
               body:JSON.stringify(obj),
               headers: {'Content-Type': 'application/json'}
            })
            let data = await res.json()
        if(data.pass){
            passErr.textContent=data.pass
        }
        if(data.email){
            emailErr.textContent=data.email
        }
        if(data.err){
         throw new Error(data.err)
     }
        if(data.user){
            location.assign('/')
        }
         }catch(err){
            console.log(err)
         }
      }
   })
})