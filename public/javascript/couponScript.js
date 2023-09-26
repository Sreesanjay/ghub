$(function () {
    $('#new-coupon').on('submit', (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to create new coupon?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let form = document.getElementById('new-coupon');
                let formData = new FormData(form)
                const obj = Object.fromEntries(formData);
                fetch('/admin/coupon-management/new-coupon', {
                    method: 'POST',
                    body: JSON.stringify(obj),
                    headers: { "Content-Type": "application/json" }
                }).then((response) => {
                    return response.json()
                }).then((data) => {
                    if (data.status === 'success') {
                        Swal.fire(
                            'Success!',
                            'coupon created succsfully',
                            'success'
                        ).then(() => location.assign('/admin/coupon-management'))
                    } else {
                        throw new Error(data.status)
                    }
                }).catch((error) => {
                    Swal.fire(
                        'Failed!',
                        error.message,
                        'error'
                    )
                })
            }
        })
    })


    $('#edit-coupon').validate({
        rules: {
            coupon_code: {
                required: true,
            },
            discount: {
                required: true,
            },
            max_count: {
                required: true,
            },
        },

        submitHandler: function (form) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You want to edit coupon?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let form = document.getElementById('edit-coupon');
                    let formData = new FormData(form)
                    const obj = Object.fromEntries(formData);
                    let id = document.getElementById('cp-id').value
                    fetch(`/admin/coupon-management/edit-coupon/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify(obj),
                        headers: { "Content-Type": "application/json" }
                    }).then((response) => {
                        return response.json()
                    }).then((data) => {
                        if (data.status === 'success') {
                            Swal.fire(
                                'Success!',
                                'Coupon edited succsfully',
                                'success'
                            ).then(() => location.assign('/admin/coupon-management'))
                        } else {
                            throw new Error(data.status)
                        }
                    }).catch((error) => {
                        Swal.fire(
                            'Failed!',
                            error.message,
                            'error'
                        )
                    })
                }
            })
        }
    })


    deleteCoupon = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to create new coupon?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(async (result) => {
            if (result.isConfirmed) {
                fetch(`/admin/coupon-management/delete-coupon/${id}`, {
                    method: 'DELETE'
                }).then((res) => {
                    return res.json()
                }).then((data) => {
                    if (data.status == 'success') {
                        Swal.fire(
                            'Success!',
                            'coupon deleted succsfully',
                            'success'
                        ).then(() => location.reload())
                    } else {
                        throw new Error(data.message)
                    }
                }).catch((error) => {
                    Swal.fire(
                        'Failed!',
                        error.message,
                        'error'
                    )
                })
            }
        })
    }
})