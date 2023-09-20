
$(() => {
    let bannerFile;
    $('#banner-image').on('change', (e) => {
        console.log("change")
        let container = document.getElementById('crp-container')
        container.style.display = "block"
        let image = document.getElementById('image')
        let file = e.target.files[0]
        $('.btn-grp').toggle()
        if (file) {
            // Create a new FileReader to read the selected image file
            var reader = new FileReader(file);
            reader.onload = function (event) {
                // Set the source of the image element in the Cropper container
                document.getElementById('image').src = event.target.result;
                // Initialize Cropper.js with the updated image source
                let cropper = new Cropper(image, {
                    aspectRatio: 18 / 5,
                    viewMode: 0,
                    autoCrop: true,
                    background: false,
                })

                $('#cropImageBtn').on('click', function () {
                    var cropedImg = cropper.getCroppedCanvas()
                    if (cropedImg) {
                        cropedImg = cropedImg.toDataURL('image/png')
                        document.getElementById('prev').src = cropedImg
                        document.getElementById('result').value = cropedImg
                        container.style.display = "none"
                        $('.btn-grp').toggle()
                    }
                    cropper.destroy();
                })
            };
            reader.readAsDataURL(file);
        }


    })

    $('.change-file').on('click', function () {
        let input = document.getElementById('banner-image')
        input.value = ''
        input.style.display = 'block'
    })



    //New  category form submit
    $('#new-banner').on('submit', async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure!',
            text: `You want to upload new banner`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {

                const form = document.getElementById('new-banner')
                const formData = new FormData(form)

                const base64String = document.getElementById('result').value
                const base64Data = base64String.split(',')[1];
                const binaryData = atob(base64Data);
                const uint8Array = new Uint8Array(binaryData.length);
                for (let i = 0; i < binaryData.length; i++) {
                    uint8Array[i] = binaryData.charCodeAt(i);
                }
                const blob = new Blob([uint8Array], { type: 'image/png' });
                const file = new File([blob], 'image.png', { type: 'image/png' });
                console.log(file)
                // formData.append('image',document.getElementById('result.value'))
                formData.append('image', file)


                fetch('/admin/banner-management/new-banner', {
                    method: "POST",
                    body: formData,
                }).then((result) => {
                    return result.json()
                }).then((data) => {
                    if (data.status === 'success') {
                        Swal.fire(
                            'Success!',
                            'New banner created successfully!',
                            'success'
                        ).then(() => location.assign('/admin/banner-management'))
                    } else {
                        throw new Error(data.message)
                    }
                }).catch((error) => {
                    Swal.fire(
                        'Error!',
                        error.message,
                        'error'
                    )
                })
            }
        })
    })






    // category edit form submit
    $('#edit-banner').on('submit', async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure!',
            text: `You want to edit this banner?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {

                const form = document.getElementById('edit-banner')
                const formData = new FormData(form)
                let body;

                const base64String = document.getElementById('result').value
                if (base64String!=='') {
                    const base64Data = base64String.split(',')[1];
                    const binaryData = atob(base64Data);
                    const uint8Array = new Uint8Array(binaryData.length);
                    for (let i = 0; i < binaryData.length; i++) {
                        uint8Array[i] = binaryData.charCodeAt(i);
                    }
                    const blob = new Blob([uint8Array], { type: 'image/png' });
                    const file = new File([blob], 'image.png', { type: 'image/png' })
                    formData.append('image', file)
                }
                const id = document.getElementById('banner_id').value
                fetch(`/admin/banner-management/edit-banner/${id}`,{
                    method:'PUT',
                    body:formData,
                }).then((result) => {
                    return result.json()
                }).then((data) => {
                    if (data.status === 'success') {
                        Swal.fire(
                            'Success!',
                            'banner edited successfully!',
                            'success'
                        ).then(() => location.assign('/admin/banner-management'))
                    } else {
                        throw new Error(data.message)
                    }
                }).catch((error) => {
                    Swal.fire(
                        'Error!',
                        error.message,
                        'error'
                    )
                })
            }
        })
    })


    //Delete banner

    deleteBanner=(e,id)=>{
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure!',
            text: `You want to edit this banner?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/admin/banner-management/delete-banner/${id}`,{
                    method: 'GET',
                }).then((result) => {
                    return result.json();
                }).then((data) => {
                    if(data.status === 'success'){
                        Swal.fire(
                            'Success!',
                            'banner deleted successfully!',
                            'success'
                        ).then(() => location.assign('/admin/banner-management'))
                    }
                    else{
                        Swal.fire(
                            'Error!',
                            data.message,
                            'error'
                        )
                    }
                })
            }
        })
    }



})