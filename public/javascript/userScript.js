

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
            try {
               const res = await fetch('/get-signup-otp', {
                  method: 'POST',
                  body: JSON.stringify({ user_email: user_email.value }),
                  headers: { 'Content-Type': 'application/json' }
               })
               const data = await res.json()
               if (data.status === 'success') {
                  const otpsection = document.querySelector('.signup-otpsection')
                  document.querySelector('.getUserOtp').style.display = "none"
                  otpsection.style.display = 'block';
                  user_name.disabled = true
                  user_email.disabled = true
                  user_mobile.disabled = true
                  user_password.disabled = true
                  rep_pass.disabled = true
               }
               else if (data.message == 'user already exsists') {
                  emailErr.innerText = data.message
               }
               else {
                  throw new Error(data.message)
               }
            } catch (err) {
               Swal.fire(
                  'Error!',
                  err.message,
                  'error'
               )
            }
      }
   }))



   $('#signup-form').on('submit', async (e) => {
      e.preventDefault()
      let user_name = document.getElementById('signup-user-name').value
      let user_email = document.getElementById('signup-user-email').value
      let user_mobile = document.getElementById('signup-user-mobile').value
      let user_password = document.getElementById('signup-user-pass').value
      let referredBy = document.getElementById('signup-user-referal').value
      let otp = document.getElementById('user-otp').value
      let otpErr = document.querySelector('.otpErr')
      let referralErr = document.querySelector('.referral-err')
      try {
         const formData = new FormData()
         formData.append('user_name', user_name)
         formData.append('user_email', user_email)
         formData.append('user_mobile', user_mobile)
         formData.append('user_password', user_password)
         formData.append('otp', otp)
         if(referredBy!=''){
            formData.append('referred_by', referredBy)
         }
         const obj = Object.fromEntries(formData);
         console.log(obj)
         const res = await fetch('/user-sign-up', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: { 'Content-Type': 'application/json' }
         })
         const data = await res.json()
         console.log(data)
         if (data.status == 'success') {
            Swal.fire(
               'Success!',
               'Your account has been regstered successfully',
               'success'
            ).then(() => location.assign("/login"))
         }
         else if (data.otpErr) {
            otpErr.innerText = data.otpErr
         }
         else if(data.referalErr){
            console.log("refferal error")
            referralErr.innerText=data.referalErr
         }else {
            throw new Error(data.message)
         }
      } catch (err) {
         Swal.fire(
            'Error!',
            e.message,
            'error'
         )
      }
   })

   //user login
   $('#user-loginForm').on('submit', async (e) => {
      e.preventDefault()
      let emailErr = document.querySelector('.emailErr')
      let passErr = document.querySelector('.passErr')
      emailErr.innerText = ''
      passErr.innerText = ''
      let form = document.getElementById('user-loginForm')
      const formData = new FormData(form)
      const email = formData.get("user_email");
      const password = formData.get("user_password")
      if (!email) {
         emailErr.innerText = 'Email is required'
      }
      else if (!password) {
         passErr.innerText = 'Password is required'
      }
      else {
         try {
            const obj = Object.fromEntries(formData);
            const res = await fetch('/user-log-in', {
               method: 'POST',
               body: JSON.stringify(obj),
               headers: { 'Content-Type': 'application/json' }
            })
            let data = await res.json()

            if (data.status === 'success') {
               location.assign("/")
            }
            else if (data.message === 'User not found!') {
               emailErr.innerText = data.message
            }
            else if (data.message == 'Incorrect password!') {
               passErr.innerText = data.message
            }
            else {
               throw new Error(data.message)
            }
         } catch (err) {
            Swal.fire(
               'Error!',
               err.message,
               'error'
            )
         }
      }
   })
   //account menu drop down
   $('.menu').on('click', () => {
      let width = window.innerWidth;
      if (width < 768) {
         $('.link-wraper').slideToggle()
      }
   })

   //click reset pass toggle old password
   $('.reset-pass-btn').on('click', () => {
      if ($('#new-pass').is(':visible')) {
         $('.new-pass').slideToggle()
         $('.down-btn').toggle();
         $('.up-btn').toggle();
      }
      else {
         document.getElementById('old_pass').value = ''
         document.getElementById('old-pass-err').textContent = ''
         $('.old-pass').slideToggle()
         $('.down-btn').toggle();
         $('.up-btn').toggle();
      }
   })

   //old pass verify
   $('.old-pass-verify').on('click', async () => {
      let oldPassErr = document.getElementById('old-pass-err')
      oldPassErr.textContent = ''
      const old_pass = document.getElementById('old_pass').value
      fetch('/account/verify-password', {
         method: 'POST',
         body: JSON.stringify({ old_pass }),
         headers: { "Content-Type": "application/json" },
      }).then((response) => {
         return response.json()
      }).then((data) => {
         console.log(data)
         if (data.status == 'success') {
            console.log('success')
            $('.old-pass').toggle()
            $('.new-pass').toggle()
         } else if (data.status == 'error') {
            oldPassErr.textContent = 'Invalid password'
         }
         else {
            throw new Error(data.message)
         }
      }).catch((err) => {
         Swal.fire(
            'Error!',
            err.message,
            'error'
         )
      })
   })

   changePass = () => {
      const password = document.getElementById('new_pass').value
      const con_pass = document.getElementById('confirm_pass').value
      const new_pass_err = document.getElementById('new-pass-err')
      const con_pass_err = document.getElementById('con-pass-err')
      new_pass_err.textContent = ''
      con_pass_err.textContent = ''
      Swal.fire({
         title: 'Are you sure!',
         text: "You want to create new Category?",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Yes'
      }).then(async (result) => {
         if (result.isConfirmed) {
            if (password.length >= 5) {
               if (password == con_pass) {
                  fetch('/account/change-password', {
                     method: 'POST',
                     body: JSON.stringify({ user_password: password }),
                     headers: { 'Content-Type': 'application/json' }
                  }).then((response) => {
                     return response.json();
                  }).then((data) => {
                     if (data.status == 'success') {
                        Swal.fire(
                           'Success!',
                           'Password changed successfully!',
                           'success'
                        ).then(() => location.assign('/account'))
                     } else {
                        throw new Error(data.message)
                     }
                  }).catch((error) => {
                     Swal.fire(
                        'Error!',
                        error.message,
                        'error'
                     )
                  })
               }
               else {
                  con_pass_err.textContent = 'Both password should be same'
               }
            } else {
               new_pass_err.textContent = 'Password must be atleast 5 characters'
            }
         }
      })
   }


   //edit usesr-------------------
   editUser = () => {
      let inputElement = $('input');
      $('input').each(function() {
         let inputElement = $(this);
         if (inputElement.prop('readonly')) {
           console.log("read only");
           inputElement.prop('readonly', false);
         } else {
           console.log("not read only");
           inputElement.prop('readonly', true);
         }
       });
      $('.gen-info-submit-btn').toggle()
   }

   //submit edit form

   $('.gen-info-submit-btn').on('click', () => {
      const user_name = document.getElementById('user-name-box').value
      const user_email = document.getElementById('email-box').value
      const user_mobile = document.getElementById('mobile-box').value
      const name_err = document.querySelector('.name-err')
      const mail_err = document.querySelector('.mail-err')
      const mobile_err = document.querySelector('.mobile-err')
      name_err.textContent = ''
      mail_err.textContent = ''
      mobile_err.textContent = ''

      Swal.fire({
         title: 'Are you sure!',
         text: "You want to edit?",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Yes'
      }).then(async (result) => {
         if (result.isConfirmed) {
            if (user_name == '') {
               name_err.textContent = 'this field is required!'
            }
            else if (user_email == '') {
               mail_err.textContent = 'this field is required!'
            }
            else if (user_mobile == '') {
               mobile_err.textContent = 'this field is required!'
            }
            else {
               fetch('/get-signup-otp', {
                  method: 'POST',
                  body: JSON.stringify({ user_email }),
                  headers: { 'Content-Type': 'application/json' }
               }).then((response) => {
                  return response.json();
               }).then((data) => {
                  if (data.status == 'success') {
                     //----------------------------------------------------------------
                     Swal.fire({
                        title: 'Verify Email',
                        text: `Please enter the OTP that has been sent to ${user_email}`,
                        input: 'text',
                        inputAttributes: {
                           autocapitalize: 'off'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Verify',
                        showLoaderOnConfirm: true,
                        preConfirm: async (otp) => {
                           return fetch('/account/editProfile', {
                              method: 'POST',
                              body: JSON.stringify({
                                 user_name,
                                 user_email,
                                 user_mobile,
                                 otp
                              }),
                              headers: { 'Content-Type': 'application/json' }
                           }).then(response => {
                              return response.json()
                           }).then((data) => {
                              console.log(data);
                              if (data.message == 'Invalid OTP') {
                                 throw new Error(data.message)
                              }
                              return data
                           }).then((result) => {
                              console.log(result)
                              if (result.status == 'success') {
                                 Swal.fire(
                                    'Success!',
                                    'profile edited successfully!',
                                    'success'
                                 ).then(() => location.assign('/account'))
                              } else {
                                 Swal.fire(
                                    'Error!',
                                    result.message,
                                    'error'
                                 )
                              }
                           }).catch(error => {
                              Swal.showValidationMessage(error.message)
                           })
                        },
                        allowOutsideClick: () => !Swal.isLoading()
                     })
                     //----------------------------------------------------------------
                  } else {
                     throw new Error(data.message)
                  }
               }).catch((error) => {
                  if (error.message == 'user already exsists') {
                     mail_err.textContent = error.message
                  }
                  else {
                     Swal.fire(
                        'Error!',
                        error.message,
                        'error'
                     )
                  }
               })
            }


         }
      })


   })


})