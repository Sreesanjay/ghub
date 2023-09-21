
$(function () {
    $('#new-address-btn').on('click', () => {
        $('.new-address-wrapper').slideToggle("linear")
        $('#new-address-btn').fadeToggle()
    })
    $('#address-cancel-btn').on('click', () => {
        $('.new-address-wrapper').slideToggle('linear');
        $('#new-address-btn').fadeToggle()
    })

    //address vlidation
    $('#new-address-form').validate({
        rules: {
            user_name: {
                required: true,
            },
            phone: {
                number:true,
                required: true,
                minlength:10,
                maxlength:10,
            },
            pincode: {
                required: true,
                number:true
            },
            locality: {
                required: true,
            },
            area_street: {
                required: true,
            },
            town: {
                required: true,
            },
            state: {
                required: true,
            },
            alternate_phone: {
                number:true,
                required: true,
                minlength:10,
                maxlength:10,
            },
            address_type: {
                required: true,
            },
            town: {
                required: true,
            },

        },
       
        submitHandler: function (form) {
            Swal.fire({
                title: 'Are you sure!',
                text: `You want to create new address?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.isConfirmed) {
                    let form = document.getElementById('new-address-form')
                    const formData = new FormData(form)
                    const body = Object.fromEntries(formData);
                    fetch('/account/new-address', {
                        method: 'POST',
                        body: JSON.stringify(body),
                        headers: { 'Content-Type': 'application/json' }
                    }).then((result) => {
                        return result.json()
                    }).then(data => {
                        if(data.status ==='success'){
                            Swal.fire(
                                'Success!',
                                'New Address Created successfuly',
                                'success'
                             ).then(() => {
                                location.reload();
                             })
                            
                        }else{
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
            })
        }
    });

    editAddress=(id)=>{
        $('.address-card'+id).slideToggle()
        $('.address-edit-card'+id).slideToggle()
        //checking address type in edit address 
        const add_type=document.getElementById('address-type'+id).value
        console.log(add_type)
        if(add_type=='Home'){
           
            $('.home-type').attr('checked',true)
        }
        else{
            $('.work-type').attr('checked',true)
        }
    }
    closeEditAddress=(id)=>{
        $('.address-card'+id).slideToggle()
        $('.address-edit-card'+id).slideToggle()
    }

      //edit address vlidation
      submitEdit=(id)=>{

            Swal.fire({
                title: 'Are you sure!',
                text: `You want to edit this address?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.isConfirmed) {
                    let form = document.getElementById('edit-address-form-'+id)
                    const formData = new FormData(form)
                    const body = Object.fromEntries(formData);
                    fetch(`/account/edit-address/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify(body),
                        headers: { 'Content-Type': 'application/json' }
                    }).then((result) => {
                        return result.json()
                    }).then(data => {
                        if(data.status ==='success'){
                            Swal.fire(
                                'Success!',
                                'Address edited successfuly',
                                'success'
                             ).then(() => {
                                location.reload();
                             })
                            
                        }else{
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
            })
    }

    //address delete
    deleteAddress=(id)=>{
        console.log("delete")
        Swal.fire({
            title: 'Are you sure!',
            text: `You want delete this address?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/account/delete-address/${id}`,{
                    method:'DELETE'
                }).then((result) => {
                    return result.json()
                }).then((data)=>{
                    if(data.status === 'success'){
                    Swal.fire(
                        'Success!',
                        'Address deleted successfuly',
                        'success'
                     ).then(() => {
                        location.reload();
                     })
                    }else{
                        throw new Error(data.message)
                    }

                }).catch((error)=>{
                    Swal.fire(
                        'Error!',
                        error.message,
                        'error'
                     )
                })
            }
        })
    }

});
