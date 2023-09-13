$(document).ready(function () {
    let err = document.querySelector('.err')
    let list = document.getElementById("spec-list");

    $('.add-spec-btn').click(function () {
        $('.new-spec-input').toggle()
    })

    $('.spec-add-btn').click(function () {
        err.textContent = ''
        let spec = $('.attribute').val()
        let val = $('.value').val()
        if (spec !== '' && val !== '') {
            let wrap = document.createElement('div');
            let prop = document.createElement('input');
            let dlt = document.createElement('button')
            prop.value = val;
            prop.setAttribute('type', 'text')
            prop.setAttribute('name', spec)
            dlt.innerHTML = '<i class="fa-regular fa-circle-xmark text-danger"></i>'
            wrap.setAttribute('id', 'prop-' + val)
            wrap.setAttribute('class', 'd-flex align-items-center')
            prop.setAttribute('class', 'm-0 form-control')
            dlt.setAttribute('id', val)
            dlt.setAttribute('class', 'btn spec-dlt-btn')
            dlt.setAttribute('type', 'button')
            wrap.appendChild(prop)
            wrap.appendChild(dlt);
            list.appendChild(wrap);

            $('.attribute').val('')
            $('.value').val('')
            $('.new-spec-input').toggle()
            $('.spec-dlt-btn').click(function (e) {
                $('#prop-' + (e.currentTarget.id)).remove()
            })

        }
        else {
            err.textContent = "Fields cannot be empty"
        }

    })

    //delete spec input box
    $('.speck-inp-dlt').click(function () {
        $('.attribute').val('')
        $('.value').val('')
        $('.new-spec-input').toggle()
    })



    //submit add product
    $('#new-prod-form').on('submit', async function (e) {
        e.preventDefault();
        const form = document.getElementById('new-prod-form')
        try {
            const formData = new FormData(form)
            body = Object.fromEntries(formData);
            let res = await fetch('/admin/products/new-product', {
                method: 'POST',
                body: formData,
            })
            let data = await res.json()
            console.log(data)
            if (!data.success) {
                if (data.serverError) {
                    console.log("server error")
                    location.assign('/admin/products/new-product')
                }
                else {
                    document.querySelector('.err').innerText = data.err
                }
            }
            else {
                location.assign('/admin/products')
            }

        } catch (e) {
            console.log(e)
        }
    });
    

})

//delete product
const deleteProduct=async(id)=>{
    let choice = confirm('Are you sure you want to delete?')
    if(choice){
    console.log('delete product')
    try{
    let res = await fetch(`/admin/products/delete-product/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    location.assign('/admin/products')
    }catch(e) {
        console.error(e.message)
    }
}
}