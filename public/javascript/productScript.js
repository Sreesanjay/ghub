$(document).ready(function () {
    let err=document.querySelector('.err')
    let specArray=[]
    let list = document.getElementById("spec-list");

    $('.add-spec-btn').click(function(){
        $('.new-spec-input').toggle()
    })
    
    $('.spec-add-btn').click(function(){
        err.textContent=''
        let spec=$('.attribute').val()
        let val=$('.value').val()
        if(spec!==''&&val!==''){
        specArray.push({
            spec,val
        })
            let wrap = document.createElement('div');
            let prop = document.createElement('p');
            let dlt=document.createElement('button')
            prop.innerText=spec+"  :  "+val;
            dlt.innerHTML='<i class="fa-regular fa-circle-xmark text-danger"></i>'
            wrap.setAttribute('id', 'prop-'+(specArray.length-1))
            wrap.setAttribute('class','d-flex align-items-center')
            prop.setAttribute('class','m-0')
            dlt.setAttribute('id',(specArray.length-1))
            dlt.setAttribute('class','btn spec-dlt-btn')
            dlt.setAttribute('type','button')
            wrap.appendChild(prop)
            wrap.appendChild(dlt);
            list.appendChild(wrap);

            $('.attribute').val('')
            $('.value').val('')
            $('.new-spec-input').toggle()
            $('.spec-dlt-btn').click(function(e){
                $('#prop-'+(e.currentTarget.id)).remove()
                specArray.splice(e.currentTarget.id,1)
            })
            
        }
        else{
            err.textContent="Fields cannot be empty"
        }
        
    })

    //delete spec input box
    $('.speck-inp-dlt').click(function(){
        $('.attribute').val('')
        $('.value').val('')
        $('.new-spec-input').toggle()
    })

    //submit add product
    $('#new-prod-form').on('submit', (async function (e) {
        e.preventDefault()
        const prodData = document.getElementById("new-prod-form");
        const formData = new FormData(prodData);
        const obj = Object.fromEntries(formData);
        console.log(obj)
    }))
    
})