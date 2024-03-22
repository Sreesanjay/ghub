$(function () {

    //address selection
    $('.address-select-btn').on('click', () => {
        const address = document.getElementsByName('delivery_address');
        let flag = 0;
        for (ad of address) {
            if (ad.checked) {
                flag = 1;
            }
        }
        if (flag == 0) {
            document.querySelector('.address-err').textContent = 'Select an address';
        } else {
            $('.down-arraow').toggle()
            $('.address-section').toggle()
            $('.payment-option').toggle()
        }
    })

    //reselect address
    $('.reselect-address').on('click', () => {
        const isToggle = $('.address-section').is(":visible")
        if (!isToggle) {
            $('.fa-chevron-down').toggle()
            $('.address-section').toggle()
            $('.payment-option').toggle()

        }

    })

    $('.proceed-to-order').on('click', () => {
        let address = document.getElementsByName('delivery_address')
        let payment = document.getElementsByName('payment_option')
        let coupon = document.getElementById('coupon-id')
        let product = document.getElementById('single-product')
        let body = {};
        let paymentflag = 0;
        let url = '/order/proceed-order'

        address.forEach((add) => {
            if (add.checked) {
                body.delivery_address = add.value
            }
        })

        payment.forEach(option => {
            if (option.checked) {
                body.payment_option = option.value
                paymentflag = 1;
            }
        })
        //validating payment option selected or not
        if (paymentflag === 0) {
            document.querySelector('.payment-err').innerText = 'Please choose payment option'
            return false;
        }

        if (coupon?.value) {
            body.coupon_id = coupon.value
        }
        if (product) {
            body.product = product.value
        }

        $('.proceed-to-order').toggle()
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
            return response.json()
        }).then((data) => {
            $('.proceed-to-order').toggle()
            if (data.status == 'success') {
                Swal.fire(
                    "Success!",
                    "Order Placed Successfully",
                    "success"
                ).then(() => {
                    history.replaceState(null, null, '/');
                    location.assign("/order/order-success")
                });
            } else if (data.status === 'paymentPending') {
                var options = {
                    "key": data.key,
                    "amount": data.amount,
                    "currency": data.currency,
                    "name": data.name,
                    "order_id": data.order_id,
                    "prefill": data.prefill,
                    "theme": {
                        "color": "#3399cc"
                    },
                    "handler": function (response) {
                        if (data.nonCartPurchase) {
                            response.nonCartPurchase = true
                        }
                        fetch('/order/payment/verify-payment', {
                            method: 'POST',
                            body: JSON.stringify(response),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }).then((res) => {
                            return res.json()
                        }).then((data) => {
                            if (data.status === 'success') {
                                Swal.fire(
                                    "Success!",
                                    "Order Placed Successfully",
                                    "success"
                                ).then(() => {
                                    history.replaceState(null, null, '/');
                                    location.assign("/order/order-success")
                                });
                            } else {
                                throw new Error(data.message);
                            }
                        })
                    },
                };

                var rzp1 = new Razorpay(options);
                rzp1.open();
                rzp1.on('payment.failed', function (response) {
                    Swal.fire("Failed!", response.error.description, "error")
                });

            }
            else {
                throw new Error(data.message)
            }
        }).catch((error) => {
            Swal.fire("Failed!", error.message, "error");
        })


    })

})