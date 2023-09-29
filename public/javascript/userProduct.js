

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
       
        fetch(`/my-cart/add-to-cart/${id}`,{
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
              }
        }).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data);
            if (data.status == 'success') {
                let timerInterval
                Swal.fire({
                    text: 'Item added to cart',
                    timer: 200,
                    didOpen: () => {
                        Swal.showLoading()
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then(() => {
                    if (!data.exist) {
                        let count = document.querySelector('.cart-count')
                        if (count.innerText) {
                            count.innerText = parseInt(count.innerText) + 1;
                        } else {
                            count.innerText = '1'
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
            ).then(() => {
                if(error.message=='Unauthorized! Please login to continue'){
                    location.assign('/login')
                }
            })

        })
    }

    //add cart item qty
    //add item qty
    increaseQty = (prod) => {
        fetch(`/my-cart/add-count/${prod}`, {
            method: 'GET'
        }).then((response) => {
            return response.json()
        }).then((data) => {
            if (data.status === 'success') {
                let qty = document.getElementById(`prod-${prod}`)
                qty.value = parseInt(qty.value) + 1;
                let price = document.getElementById(`price-${prod}`)
                let total = parseInt(price.value) * parseInt(qty.value)
                const dis = document.getElementById(`price${prod}`)
                dis.value = total
                let crtTotal = document.getElementById('cart_total')
                crtTotal.value = parseInt(crtTotal.value) + parseInt(price.value)

                let totalPrice = document.getElementById('total_price')
                let cpDisc = document.getElementById('coupon-disc')
                if (cpDisc.value) {
                    totalPrice.value = parseInt(crtTotal.value) - parseInt(cpDisc.value)
                } else {
                    totalPrice.value = parseInt(crtTotal.value)
                }
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

    //dec cart item qty
    decreaseQty = (prod) => {
        fetch(`/my-cart/dec-count/${prod}`, {
            method: 'GET'
        }).then((response) => {
            return response.json()
        }).then((data) => {
            if (data.status === 'success') {
                let qty = document.getElementById(`prod-${prod}`)
                qty.value = parseInt(qty.value) - 1;
                let price = document.getElementById(`price-${prod}`)
                let total = parseInt(price.value) * parseInt(qty.value)
                const dis = document.getElementById(`price${prod}`)
                dis.value = total

                let crtTotal = document.getElementById('cart_total')
                crtTotal.value = parseInt(crtTotal.value) - parseInt(price.value)

                let totalPrice = document.getElementById('total_price')
                let cpDisc = document.getElementById('coupon-disc')
                if (cpDisc.value) {
                    totalPrice.value = parseInt(crtTotal.value) - parseInt(cpDisc.value)
                } else {
                    totalPrice.value = parseInt(crtTotal.value)
                }

                let quantity = document.getElementById('prod-'+prod)
                let stock = document.getElementById('stock-'+prod)
                let outofstock = document.getElementById('out-of-stock-'+prod)
                if(outofstock){
                    console.log("out of stock")
                    if(parseInt(quantity.value)<=parseInt(stock.value)){
                        outofstock.innerText=''
                    }
                }
            } else if (data.status === 'failed') {
                return false;
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

    //remove from cart
    removeCart = (id) => {
        Swal.fire({
            title: 'Are you sure',
            text: "You want to remove item from your cart?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(async (result) => {
            if (result.isConfirmed) {
                fetch(`/my-cart/remove-item/${id}`, {
                    method: 'DELETE'
                }).then((response) => {
                    return response.json()
                }).then((data) => {
                    if (data.status === 'success') {
                        let timerInterval
                        Swal.fire({
                            text: 'Item removed from cart',
                            timer: 200,
                            didOpen: () => {
                                Swal.showLoading()
                            },
                            willClose: () => {
                                clearInterval(timerInterval)
                            }
                        }).then(() => {
                            location.reload()
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

    applyCpn = (e, cpn_id, disc) => {
        e.preventDefault()
        let coupon_id = document.getElementById('coupon-id')
        coupon_id.value = cpn_id
        if ($('.disc-grp').is(":visible")) {
        } else {
            $('.disc-grp').toggle()
        }
        let crtTotal = document.getElementById('cart_total').value
        let coupon_disc = document.getElementById('coupon-disc')
        coupon_disc.value = parseInt((crtTotal * disc) / 100)

        let totalPrice = document.getElementById('total_price')
        let cpDisc = document.getElementById('coupon-disc')
        let link = document.querySelector('.checkout-link')
        link.href = link.href + '?cpn=' + cpn_id
        console.log(link.href)
        if (cpDisc.value) {
            totalPrice.value = parseInt(crtTotal) - parseInt(cpDisc.value)
        } else {
            totalPrice.value = parseInt(crtTotal.value)
        }
        $('.coupon-select-wrapper').toggle()
        $('.apply-cpn' + cpn_id).toggle()
        $('.remove-cpn' + cpn_id).toggle()

    }
    removeCpn = (e, cpn_id) => {
        e.preventDefault()
        $('.coupon-select-wrapper').toggle()
        $('.apply-cpn' + cpn_id).toggle()
        $('.remove-cpn' + cpn_id).toggle()
        document.getElementById('coupon-disc').value = '';
        document.getElementById('coupon-id').value = ''
        $('.disc-grp').toggle()
    }

    //open coupon
    $('#check-coupon').on('click', (e) => {
        e.preventDefault()
        $('.coupon-select-wrapper').toggle()
    })
    //close coupon
    $('.close-cpn').on('click', () => {
        $('.coupon-select-wrapper').toggle()
    })


    //check out of stock
    getCheckout = (e) => {
        let quantity = document.getElementsByName('quantity')
        let stock = document.getElementsByName('stock')
        for (let i = 0; i < quantity.length; i++) {
            if (parseInt(quantity[i].value) > parseInt(stock[i].value)) {
                e.preventDefault()
                Swal.fire(
                    'Failed',
                    'Some products are out of stock please remove those products and try again',
                    'error'
                )
            }
        }

    }
    // //get checkout 
    // $('.getCheckout').on('click',()=>{

    //     let coupon_id= document.getElementById('coupon-id')
    //     if(coupon_id.value){
    //         const url='order/get-checkout/'+coupon_id.value
    //     }else{
    //         const url='order/get-checkout'
    //     }
    //     fetch(url,{
    //         method:'GET'
    //     }).then((response)=>{
    //         return response.json()
    //     }).then((data)=>{

    //     })
    // })



    $('#show-more').on('click', () => {
        $('#prod-disc').css('height', 'max-content')
        $('#show-more').toggle();
        $('#show-less').toggle();
    })
    $('#show-less').on('click', () => {
        $('#prod-disc').css('height', '100px')
        $('#show-more').toggle();
        $('#show-less').toggle();
    })

    setImgView = (id) => {
        let imagePath = $('#' + id).attr('src');
        let primary_img_path = $('#primary-img-view').attr('src');
        $('#' + id).attr('src', primary_img_path);
        $('#primary-img-view').attr('src', imagePath);
    }

    $('.left-img-scroll').on('click', () => {
        let left = document.querySelector('.sec-img-wrapper')
        left.scrollBy(-200, 0)
    })
    $('.right-img-scroll').on('click', () => {
        let right = document.querySelector('.sec-img-wrapper')
        right.scrollBy(200, 0)
    })
})