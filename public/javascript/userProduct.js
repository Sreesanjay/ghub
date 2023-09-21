
$(function () {
    addToWishlist = (e, id) => {
        console.log(id);
        e.preventDefault();
        fetch(`/account/add-to-wishlist/${id}`, {
            method: 'GET'
        }).then((response) => {
            return response.json()
        }).then((data) => {
            if (data.status === 'success') {
                let timerInterval
                Swal.fire({
                    text: 'Item added to wishlist',
                    timer: 500,
                    didOpen: () => {
                        Swal.showLoading()
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                })
            }
            if (data.message) {
                throw new Error(data.message)
            }
        }).catch((error) => {
            Swal.fire(
                'Failed',
                error.message,
                'error'
            )
        })
    }

    deleteWish = (id) => {
        Swal.fire({
            title: 'Are you sure',
            text: "You want to remove item from wish list?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Update it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                fetch(`/account/delete-wish/${id}`).then((response) => {
                    return response.json()
                }).then((data) => {
                    if (data.status === 'success') {
                        Swal.fire(
                            'Success',
                            'item removed from wishlist',
                            'success'
                        ).then(() => {
                            this.location.reload()
                        })

                    } else {
                        throw new Error(data.message)
                    }
                }).catch((error) => {
                    Swal.fire(
                        'Failed',
                        error.message,
                        'error'
                    )
                })
            }
        })
    }


    //add to cart
    addToCart = (e, id) => {
        e.preventDefault();
                fetch(`/add-to-cart/${id}`, {
                    method: 'GET'
                }).then((response) => {
                    return response.json()
                }).then((data) => {
                    if (data.status == 'success') {
                        let timerInterval
                        Swal.fire({
                            text: 'Item added to cart',
                            timer: 500,
                            didOpen: () => {
                                Swal.showLoading()
                            },
                            willClose: () => {
                                clearInterval(timerInterval)
                            }
                        }).then(() => {
                        if(!data.exist){
                        let count=document.querySelector('.cart-count')
                        if(count.innerText){
                        count.innerText=parseInt(count.innerText)+1;
                        }else{
                            count.innerText='1'
                        }
                         }
                        })
                    }
                    else {
                        throw new Error(data.message)
                    }
                }).catch((error) => {
                    Swal.fire(
                        'Failed',
                        error.message,
                        'error'
                    )
                })
    }
})