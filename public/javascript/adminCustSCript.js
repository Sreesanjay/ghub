$(document).ready(function () {
    blockUser = (e, user, id) => {
        e.preventDefault();
        const blockBtn = document.getElementById('blockBtn')
        Swal.fire({
            title: 'Are you sure!',
            text: `You want to block ${user}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(blockBtn.href)
                location.href = `/admin/customers/block-customer/${id}`
            }
        })
    }

    unblockUser = (e, user) => {
        e.preventDefault();
        const unblockBtn = document.getElementById('unblockBtn')
        Swal.fire({
            title: 'Are you sure!',
            text: `You want unblock ${user}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                location.href = unblockBtn.href
            }
        })
    }

})