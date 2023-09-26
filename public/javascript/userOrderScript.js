$(function(){

    //address selection
    $('.address-select-btn').on('click', ()=>{
        const address = document.getElementsByName('delivery_address');
        let flag=0;
        for(ad of address){
            if(ad.checked){
                flag=1;
            }
        }
        if(flag==0){
            document.querySelector('.address-err').textContent='Select an address';
        }else{
            $('.down-arraow').toggle()
            $('.address-section').toggle()
            $('.payment-option').toggle()
        }
    })

    //reselect address
    $('.reselect-address').on('click', ()=>{
        const isToggle=$('.address-section').is(":visible")
        if(!isToggle){
            $('.fa-chevron-down').toggle()
            $('.address-section').toggle()
            $('.payment-option').toggle()

        }
       
    })

    $('.proceed-to-order').on('click', ()=>{
        let address = document.getElementsByName('delivery_address')
        let payment = document.getElementsByName('payment_option')
        let coupon= document.getElementById('cpn_id')
        let body={};

        address.forEach((add)=>{
            if(add.checked){
                body.delivery_address = add.value
            }
        })

        payment.forEach(option=>{
            if(option.checked){
                body.payment_option=option.value
            }
        })

        if(coupon?.value){
            body.coupon_id=coupon.value
        }

        fetch('/order/proceed-order',{
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        }).then((response)=>{
            return response.json()
        }).then((data)=>{

        })


    })

})