$(document).ready(function () {
    //new category
    $('#new-category').on('submit', (e)=>{
        e.preventDefault()
        const err=document.querySelector('.err')
        err.textContent=''
        Swal.fire({
            title: 'Are you sure!',
            text: "You want to create new Category?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then(async(result) => {
            if (result.isConfirmed) {
                const form=document.getElementById('new-category')
                const formData=new FormData(form)
                const body = Object.fromEntries(formData);
                
                fetch('/admin/category/new-category', {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {'Content-Type': 'application/json'}
                })
                .then(response =>{return response.json()})
                .then(data => {
                    if(data.status==='success') {
                        Swal.fire(
                            'Created!',
                            'New category created successfully!',
                            'success'
                          )
                    }
                    else{

                        throw new Error(data.message)
                    }
                })
                .catch(error => {
                    if(error.message='Category name already exsists!'){
                        err.textContent='Category name already exsists!'
                    }
                    else{
                        Swal.fire(
                            'Error!',
                            error.message,
                            'error'
                          )
                    }
                    
                });
            }
          })
    })


    //admin edit category
    $('#edit-category').on('submit', (async function (e) {
        let err=document.querySelector('.err')
        err.textContent=''
        e.preventDefault();
        try {
            const editData = document.getElementById("edit-category");
            const formData = new FormData(editData);
            const obj = Object.fromEntries(formData);
            let res = await fetch(`/admin/category/edit-category/${obj.id}`, {
                method: 'PUT',
                body: JSON.stringify({ obj}),
                headers: { 'Content-Type': 'application/json' }
            })
            let data = await res.json()
            if(data.success) {
                location.assign('/admin/category')
            }
            if(data.err){
                err.textContent=data.err
            }
        } catch (e) {
            err.textContent='sorry ! internel server error';
        }

    }))
});
//delete category
async function deleteCategory(id){
    let choice = confirm('Are you sure you want to delete?')
    if(choice){
    console.log('delete category')
    try{
    let res = await fetch(`/admin/category/delete-category/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    location.assign('/admin/category')
    }catch(e) {
        console.error(e.message)
    }
}
}