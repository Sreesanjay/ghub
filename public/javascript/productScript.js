$(document).ready(function () {
     let err = document.querySelector(".err");
     let specArray = [];
     let list = document.getElementById("spec-list");

     //Toggling new input tag for creating a new specification
     $(".add-spec-btn").click(function () {
          $(".new-spec-input").toggle();
     });

     //Adding new specification to form
     $(".spec-add-btn").click(function () {
          err.textContent = "";
          let spec = $(".attribute").val();
          let val = $(".value").val();
          if (spec !== "" && val !== "") {
               specArray.push({
                    spec,
                    val,
               });
               let wrap = document.createElement("div");
               let prop = document.createElement("p");
               let dlt = document.createElement("button");
               prop.innerText = spec + "  :  " + val;
               dlt.innerHTML =
                    '<i class="fa-regular fa-circle-xmark text-danger"></i>';
               wrap.setAttribute("id", "prop-" + (specArray.length - 1));
               wrap.setAttribute("class", "d-flex align-items-center");
               prop.setAttribute("class", "m-0");
               dlt.setAttribute("id", specArray.length - 1);
               dlt.setAttribute("class", "btn spec-dlt-btn");
               dlt.setAttribute("type", "button");
               wrap.appendChild(prop);
               wrap.appendChild(dlt);
               list.appendChild(wrap);

               $(".attribute").val("");
               $(".value").val("");
               $(".new-spec-input").toggle();

               //Deleting the specification
               $(".spec-dlt-btn").click(function (e) {
                    Swal.fire({
                         title: "Are you sure!",
                         text: "You want to delete the specification?",
                         icon: "warning",
                         showCancelButton: true,
                         confirmButtonColor: "#3085d6",
                         cancelButtonColor: "#d33",
                         confirmButtonText: "Yes, delete it!",
                    }).then((result) => {
                         if (result.isConfirmed) {
                              $("#prop-" + e.currentTarget.id).remove();
                              specArray.splice(e.currentTarget.id, 1);
                         }
                    });
               });
          } else {
               err.textContent = "Fields cannot be empty";
          }
     });

     //delete specification input box
     $(".speck-inp-dlt").click(function () {
          $(".attribute").val("");
          $(".value").val("");
          $(".new-spec-input").toggle();
     });

     //Add secondary image
     let secImgCount = 0;
     let totalImgCount = 0;
     newSecImage = () => {
          if (totalImgCount < 8) {
               const secInpGroup = document.querySelector(".sec-inp-group");
               const wrap = document.createElement("div");
               wrap.setAttribute("id", "sec-wrap-" + secImgCount);
               wrap.setAttribute("class", "d-flex align-items-center py-3");
               secInpGroup.appendChild(wrap);

               const inp = document.createElement("input");
               inp.setAttribute("type", "file");
               inp.setAttribute("class", "form-control");
               inp.setAttribute("accept", ".jpeg,.png,.jpg,.webp");
               inp.setAttribute("name", "secondary_img");
               inp.setAttribute("id", "secondary_image");

               const dlt = document.createElement("i");
               dlt.setAttribute("class", "fa-solid fa-delete-left ms-3");
               dlt.setAttribute("onclick", `dltSecImg(${secImgCount})`);

               wrap.appendChild(inp);
               wrap.appendChild(dlt);
               secImgCount++;
               totalImgCount++;
          } else {
               const err = document.querySelector(".sec-img-err");
               err.innerText = "Maximum number of images is 8!";
          }
     };

     //deleting secondary image
     dltSecImg = (secImg) => {
          Swal.fire({
               title: "Are you sure!",
               text: "You want to delete this image",
               icon: "warning",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "Yes, delete it!",
          }).then((result) => {
               if (result.isConfirmed) {
                    const err = document.querySelector(".sec-img-err");
                    $("#sec-wrap-" + secImg).remove();
                    totalImgCount--;
                    if (secImgCount < 8) {
                         err.innerText = "";
                    }
               }
          });
     };

     $("#primary_img").on("change", (e) => {
          console.log("got req");
          let container = document.getElementById("crp-container");
          container.style.display = "block";
          let image = document.getElementById("image");
          let file = e.target.files[0];
          $(".new-prod-submit").toggle();
          if (file) {
               // Create a new FileReader to read the selected image file
               var reader = new FileReader(file);
               reader.onload = function (event) {
                    // Set the source of the image element in the Cropper container
                    document.getElementById("image").src = event.target.result;
                    // Initialize Cropper.js with the updated image source
                    let cropper = new Cropper(image, {
                         aspectRatio: 9 / 10,
                         viewMode: 0,
                         autoCrop: true,
                         background: false,
                    });

                    $("#cropImageBtn").on("click", function () {
                         var cropedImg = cropper.getCroppedCanvas();
                         console.log(cropedImg);
                         if (cropedImg) {
                              cropedImg = cropedImg.toDataURL("image/png");
                              document.getElementById("result").value =
                                   cropedImg;
                              container.style.display = "none";
                              $(".new-prod-submit").toggle();
                         }
                         cropper.destroy();
                    });
               };
               reader.readAsDataURL(file);
          }
     });

     $(".change-file").on("click", function () {
          let input = document.getElementById("primary_img");
          input.value = "";
          input.style.display = "block";
     });

     $.validator.addMethod(
          "positive",
          function (value, element) {
               return parseFloat(value) >= 0;
          },
          "Please enter a positive number"
     );

     $.validator.addMethod(
          "lessThan100",
          function (value, element) {
               return parseFloat(value) <= 100;
          },
          "Please enter a percentage value."
     );

     //submit add product
     $("#new-prod-form").validate({
          rules: {
               product_name: {
                    required: true,
                    maxlength: 80,
               },
               brand_name: {
                    required: true,
                    maxlength: 15,
               },
               stock: {
                    required: true,
                    number: true,
                    positive: true,
               },
               prod_price: {
                    required: true,
                    number: true,
                    positive: true,
               },
               sellig_price: {
                    required: true,
                    number: true,
                    positive: true,
               },
               GST: {
                    required: true,
                    number: true,
                    positive: true,
                    lessThan100: true,
               },
               prod_color: {
                    required: true,
               },
               discription: {
                    required: true,
               },
          },

          submitHandler: function (form) {
               Swal.fire({
                    title: "Are you sure?",
                    text: "You want to add new product?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes",
               }).then(async (result) => {
                    if (result.isConfirmed) {
                         const form = document.getElementById("new-prod-form");
                         try {
                              const formData = new FormData(form);
                              console.log(specArray);
                              const specArrayJson = JSON.stringify(specArray);
                              formData.append("specification", specArrayJson);
                              const base64String =
                                   document.getElementById("result").value;
                              const base64Data = base64String.split(",")[1];
                              const binaryData = atob(base64Data);
                              const uint8Array = new Uint8Array(
                                   binaryData.length
                              );
                              for (let i = 0; i < binaryData.length; i++) {
                                   uint8Array[i] = binaryData.charCodeAt(i);
                              }
                              const blob = new Blob([uint8Array], {
                                   type: "image/png",
                              });
                              const file = new File([blob], "image.png", {
                                   type: "image/png",
                              });
                              console.log(file);
                              // formData.append('image',document.getElementById('result.value'))
                              formData.append("primary_img", file);
                              body = Object.fromEntries(formData);
                              let res = await fetch(
                                   "/admin/products/new-product",
                                   {
                                        method: "POST",
                                        body: formData,
                                   }
                              );
                              let data = await res.json();
                              if (data.success) {
                                   Swal.fire(
                                        "Created!",
                                        "New product has been created successfully.",
                                        "success"
                                   ).then(() =>
                                        location.assign("/admin/products")
                                   );
                              } else {
                                   throw new Error(data.message);
                              }
                         } catch (e) {
                              Swal.fire("Error!", e.message, "error");
                         }
                    }
               });
          },
     });

     //-------------------Edit Product--------------------

     let changeProdImg = [];
     let fieldCount = 0;
     let totalFilds = 0;

     addSpecField = () => {
          let parent = document.querySelector(".spec-wraper");

          let fieldWrapper1 = document.createElement("div");
          fieldWrapper1.setAttribute("id", "spec-" + fieldCount);
          fieldWrapper1.setAttribute("class", "col-sm-12 col-md-5 mb-3");

          let fieldWrapper2 = document.createElement("div");
          fieldWrapper2.setAttribute("id", "val-" + fieldCount);
          fieldWrapper2.setAttribute("class", "col-sm-12 col-md-6 mb-3");

          let specInp1 = document.createElement("input");
          specInp1.setAttribute("type", "text");
          specInp1.setAttribute("class", "form-control");
          specInp1.setAttribute("name", "spec");
          specInp1.setAttribute("placeholder", "specification");

          let specInp2 = document.createElement("input");
          specInp2.setAttribute("type", "text");
          specInp2.setAttribute("class", "form-control");
          specInp2.setAttribute("name", "val");
          specInp2.setAttribute("placeholder", "value");

          let dltSpec = document.createElement("i");
          dltSpec.setAttribute(
               "class",
               "fa-regular fa-circle-xmark text-danger col-md-1 mt-2"
          );
          dltSpec.setAttribute("id", `btn-${fieldCount}`);
          dltSpec.setAttribute("onclick", `deleteSpec('${fieldCount}')`);

          parent.appendChild(fieldWrapper1);
          parent.appendChild(fieldWrapper2);
          parent.appendChild(dltSpec);

          fieldWrapper1.appendChild(specInp1);
          fieldWrapper2.appendChild(specInp2);

          fieldCount++;
          totalFilds++;
     };

     //delete spec
     deleteSpec = (field) => {
          Swal.fire({
               title: "Are you sure!",
               text: "You want to delete the specification?",
               icon: "warning",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "Yes, delete it!",
          }).then((result) => {
               if (result.isConfirmed) {
                    console.log(field);
                    const specToDlt = document.getElementById("spec-" + field);
                    const valToDlt = document.getElementById("val-" + field);
                    const btnToDlt = document.getElementById("btn-" + field);
                    specToDlt.remove();
                    valToDlt.remove();
                    btnToDlt.remove();
                    totalFilds--;
               }
          });
     };

     //preview changed image
     previewImg = (e, img_id, path) => {
          if (path == "secondary_img") {
               changeProdImg.push(img_id);
          }

          let image = URL.createObjectURL(e.target.files[0]);
          let imgPreview = document.getElementById("img" + e.target.id);
          imgPreview.src = image;
     };

     //adding new input tag for edit image
     let addImgCount = 0;
     let imgcount = 0;

     addSecImage = () => {
          if (imgcount + document.getElementById("sec-img-length").value < 8) {
               const secImage = document.querySelector(".secondary-img");

               const img = document.createElement("img");
               img.setAttribute("src", "");
               img.setAttribute("id", "img" + addImgCount);
               img.setAttribute("style", "width:70px;");
               img.setAttribute("class", "col-md-3 mb-2");
               secImage.appendChild(img);

               const inpWrap = document.createElement("div");
               inpWrap.setAttribute(
                    "class",
                    "col-sm-10 col-md-9 d-flex align-self-start"
               );
               secImage.appendChild(inpWrap);

               const inp = document.createElement("input");
               inp.setAttribute("type", "file");
               inp.setAttribute("name", "secondary_img");
               inp.setAttribute("accept", ".jpeg,.png,.jpg,.webp");
               inp.setAttribute("class", "form-control mb-2 prod-img");
               inp.setAttribute("id", addImgCount);
               inp.setAttribute(
                    "onchange",
                    `previewImg(event,'${addImgCount}','prod_img_2')`
               );
               inpWrap.appendChild(inp);

               const dlt = document.createElement("i");
               dlt.setAttribute("class", "fa-solid fa-delete-left m-3");
               dlt.setAttribute(
                    "onclick",
                    `deleteImg('${addImgCount}','sec_img','${addImgCount}')`
               );
               inpWrap.appendChild(dlt);
               addImgCount++;
               imgcount++;
          } else {
               document.querySelector(".sec-img-err").innerText =
                    "Maximum Number of secondary image is 8";
          }
     };

     //delete existing image
     deleteImg = (img_id, path, filename) => {
          Swal.fire({
               title: "Are you sure!",
               text: " you want to delete this image?",
               icon: "warning",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "Yes, delete it!",
          }).then((result) => {
               if (result.isConfirmed) {
                    if (path == "secondary_img") {
                         changeProdImg.push(img_id);
                    }
                    document.getElementById("img" + filename).remove();
                    document.getElementById(filename).parentElement.remove();
                    imgcount--;
                    if (
                         imgcount +
                              document.getElementById("sec-img-length").value <
                         8
                    ) {
                         document.querySelector(".sec-img-err").innerText = "";
                    }
                    Swal.fire(
                         "Deleted!",
                         "Your file has been deleted.",
                         "success"
                    );
               }
          });
     };

     //edit primary image crop
     $(".primary-img-edit").on("change", (e) => {
          console.log("got req");
          let container = document.getElementById("crp-container");
          container.style.display = "block";
          let image = document.getElementById("image");
          let file = e.target.files[0];
          $(".edit-prod-submit").toggle();
          if (file) {
               // Create a new FileReader to read the selected image file
               var reader = new FileReader(file);
               reader.onload = function (event) {
                    // Set the source of the image element in the Cropper container
                    document.getElementById("image").src = event.target.result;
                    // Initialize Cropper.js with the updated image source
                    let cropper = new Cropper(image, {
                         aspectRatio: 1 / 1,
                         viewMode: 0,
                         autoCrop: true,
                         background: false,
                    });

                    $("#cropImageBtn").on("click", function () {
                         var cropedImg = cropper.getCroppedCanvas();
                         console.log(cropedImg);
                         if (cropedImg) {
                              cropedImg = cropedImg.toDataURL("image/png");
                              document.getElementById("result").value =
                                   cropedImg;
                              container.style.display = "none";
                              $(".edit-prod-submit").toggle();
                         }
                         cropper.destroy();
                    });
               };
               reader.readAsDataURL(file);
          }
     });
     //Edit product form submit
     $("#editForm").validate({
          rules: {
               product_name: {
                    required: true,
                    maxlength: 80,
               },
               brand_name: {
                    required: true,
                    maxlength: 15,
               },
               stock: {
                    required: true,
                    number: true,
                    positive: true,
               },
               prod_price: {
                    required: true,
                    number: true,
                    positive: true,
               },
               sellig_price: {
                    required: true,
                    number: true,
                    positive: true,
               },
               GST: {
                    required: true,
                    number: true,
                    positive: true,
                    lessThan100: true,
               },
               prod_color: {
                    required: true,
               },
               discription: {
                    required: true,
               },
          },
          submitHandler: function (form) {
               Swal.fire({
                    title: "Are you sure?",
                    text: "You want to update the product?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, Update it!",
               }).then(async (result) => {
                    if (result.isConfirmed) {
                         const form = document.getElementById("editForm");
                         try {
                              const formData = new FormData(form);
                              const id =
                                   document.getElementById("userId").value;
                              const imgArrayJson =
                                   JSON.stringify(changeProdImg);
                              formData.append("changeProdImg", imgArrayJson);
                              const base64String =
                                   document.getElementById("result").value;
                              const base64Data = base64String.split(",")[1];
                              const binaryData = atob(base64Data);
                              const uint8Array = new Uint8Array(
                                   binaryData.length
                              );
                              for (let i = 0; i < binaryData.length; i++) {
                                   uint8Array[i] = binaryData.charCodeAt(i);
                              }
                              const blob = new Blob([uint8Array], {
                                   type: "image/png",
                              });
                              const file = new File([blob], "image.png", {
                                   type: "image/png",
                              });
                              console.log(file);
                              // formData.append('image',document.getElementById('result.value'))
                              formData.append("primary_img", file);

                              let res = await fetch(
                                   `/admin/products/edit-product/${id}`,
                                   {
                                        method: "PUT",
                                        body: formData,
                                   }
                              );
                              const data = await res.json();
                              if (data.success) {
                                   Swal.fire(
                                        "Updated!",
                                        "Produt has been updated.",
                                        "success"
                                   ).then(() => {
                                        location.assign("/admin/products");
                                   });
                              } else {
                                   throw new Error(data.message);
                              }
                         } catch (e) {
                              Swal.fire("Failed", e.message, "error");
                         }
                    }
               });
          },
     });
});

//-------------------------Delete product-----------------
const deleteProduct = async (id) => {
     Swal.fire({
          title: "Are you sure?",
          text: "You want to delete the product?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
     }).then(async (result) => {
          if (result.isConfirmed) {
               try {
                    let res = await fetch(
                         `/admin/products/delete-product/${id}`,
                         {
                              method: "DELETE",
                              headers: { "Content-Type": "application/json" },
                         }
                    );
                    const data = await res.json();
                    if (data.status == "success") {
                         Swal.fire(
                              "Success!",
                              "Product deleted succsfully",
                              "success"
                         ).then(() => location.reload());
                    } else {
                         throw new Error(data.message);
                    }
               } catch (e) {
                    console.log(e.message);
                    Swal.fire("Failed!", e.message, "error");
               }
          }
     });
};
