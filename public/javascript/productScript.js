$(document).ready(function () {

    let err = document.querySelector('.err')
    let specArray = []
    let list = document.getElementById("spec-list");


    $('.add-spec-btn').click(function () {
        $('.new-spec-input').toggle()
    })

    $('.spec-add-btn').click(function () {
        err.textContent = ''
        let spec = $('.attribute').val()
        let val = $('.value').val()
        if (spec !== '' && val !== '') {
            specArray.push({
                spec, val
            })
            let wrap = document.createElement('div');
            let prop = document.createElement('p');
            let dlt = document.createElement('button')
            prop.innerText = spec + "  :  " + val;
            dlt.innerHTML = '<i class="fa-regular fa-circle-xmark text-danger"></i>'
            wrap.setAttribute('id', 'prop-' + (specArray.length - 1))
            wrap.setAttribute('class', 'd-flex align-items-center')
            prop.setAttribute('class', 'm-0')
            dlt.setAttribute('id', (specArray.length - 1))
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
                specArray.splice(e.currentTarget.id, 1)
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
            let fileInput=document.getElementById('prod_img_2')
            console.log(fileInput.files.length)
            if(fileInput.files.length<4){
            const formData = new FormData(form)
            console.log(specArray)
            const specArrayJson = JSON.stringify(specArray)
            formData.append('specification', specArrayJson)
            body = Object.fromEntries(formData);
            let res = await fetch('/admin/products/new-product', {
                method: 'POST',
                body: formData,
            })
            let data = await res.json()
            if (data.serverError) {
                location.assign('/admin/products/new-product')
            }
            else {
                location.assign('/admin/products')
            }
        }else{
            document.querySelector('.err').innerText="maximum files should be less than 4"
        }

        } catch (e) {
            console.log(e)
        }
    });

    previewImg=(e)=>{
    console.log(e.target.value)
    let image=URL.createObjectURL(e.target.files[0]);
    let imgPreview=document.getElementById('img'+e.target.id)
    imgPreview.src=image;
    }
  

})

//delete product
const deleteProduct = async (id) => {
    let choice = confirm('Are you sure you want to delete?')
    if (choice) {
        console.log('delete product')
        try {
            let res = await fetch(`/admin/products/delete-product/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            location.assign('/admin/products')
        } catch (e) {
            
            console.error(e.message)
        }
    }
}

$('#editForm').on('submit', async function (e) {
    console.log("submitted")
    e.preventDefault();
    const form=document.getElementById("editForm")
    try {
        const formData = new FormData(form)
        let res = await fetch('/admin/products/edit-product', {
            method: 'POST',
            body: formData,
        })
        let data = await res.json()
        if (data.serverError) {
            location.assign('/admin/products/new-product')
        }
        else {
            location.assign('/admin/products')
        }

    } catch (e) {
        console.log(e)
    }
    
})
