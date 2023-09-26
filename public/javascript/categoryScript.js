$(document).ready(function () {
    //new category
    $('#new-category').validate({
        rules: {
            cat_name: {
                  required: true,
                  maxlength: 50,
             },
             discription: {
                  required: true,
                  maxlength: 200,
             },
             
        },
        submitHandler: function (form) {
        e.preventDefault()
        const err = document.querySelector('.err')
        err.textContent = ''
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
                const form = document.getElementById('new-category')
                const formData = new FormData(form)
                const body = Object.fromEntries(formData);

                fetch('/admin/category/new-category', {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(response => { return response.json() })
                    .then(data => {
                        if (data.status === 'success') {
                            Swal.fire(
                                'Created!',
                                'New category created successfully!',
                                'success'
                            ).then(() => location.assign('/admin/category'))
                        }
                        else {

                            throw new Error(data.message)
                        }
                    })
                    .catch(error => {
                        if (error.message = 'A similar category already exists') {
                            err.textContent = error.message
                        }
                        else {
                            Swal.fire(
                                'Error!',
                                error.message,
                                'error'
                            )
                        }

                    });
            }
        })
    }
    })


    //admin edit category
    $('#edit-category').on('submit', (async function (e) {
        let err = document.querySelector('.err')
        err.textContent = ''
        e.preventDefault();

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
                try {
                    const editData = document.getElementById("edit-category");
                    const formData = new FormData(editData);
                    const obj = Object.fromEntries(formData);
                    let res = await fetch(`/admin/category/edit-category/${obj.id}`, {
                        method: 'PUT',
                        body: JSON.stringify(obj),
                        headers: { 'Content-Type': 'application/json' }
                    })
                    let data = await res.json()
                    if (data.status == 'success') {
                        Swal.fire(
                            'Created!',
                            'New category created successfully!',
                            'success'
                        ).then(() => location.assign('/admin/category'))
                    }
                    else if (data.message == 'A similar category already exists') {
                        err.textContent = data.message;
                    }
                    else {
                        throw new Error(data.message)
                    }
                } catch (e) {
                    Swal.fire(
                        'Error!',
                        e.message,
                        'error'
                    )
                }
            }
        })

    }))
});



//delete category
async function deleteCategory(id) {
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
            try {
                let res = await fetch(`/admin/category/delete-category/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                })
                const data = await res.json()
                if (data.status == 'success') {
                    Swal.fire(
                        'Created!',
                        'New category created successfully!',
                        'success'
                    ).then(() => {
                        location.reload()
                    })
                }
                else {
                    throw new Error(data.message)
                }
            } catch (e) {
                Swal.fire(
                    'Error!',
                    e.message,
                    'error'
                )
            }
        }
    })

}