$(document).ready(function () {

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