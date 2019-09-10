// Get the modal
var modal = document.getElementById('addimagediv');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
  }
  
function show(val){
  console.log('fun hai yaha',val)
  document.getElementById(val).style.display='block'
  return true
}
 
function uploadPicture (form){
    console.log('in upload image')
    const data = new FormData();
    let result=false
    console.log('file is ',$("#uploadImage")[0].files[0])
    data.append( 'profileImage', $("#uploadImage")[0].files[0], $("#uploadImage")[0].files[0].name );
    console.log('form',data)
    console.log('req form ',form)
    return false
    // if ( $("#uploadImage")[0].files[0] ) {
    //     console.log('IN IF TO UPLOAD FILE')
    //     // axios.post('/upload-image',data,{ 
    //     //     headers:{
    //     //         'accept': 'application/json',
    //     //         'Accept-Language': 'en-US,en;q=0.8',
    //     //         'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
    //     //     },
    //     // })
    //     $.ajax({
    //         url: '/upload-image', 
    //         type: 'POST', 
    //         processData: false,
    //         ContentType: `multipart/form-data; boundary=${data._boundary}`,
    //         data:data
    //     })
    //     .catch(err=>{console.log('error in first catch',err)})
    //     .then( ( response ) => {
    //         if ( 200 === response.status ) {
    //             // If file size is larger than expected.
    //             if( response.data.error ) {
    //             if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
    //                 alert( 'Max size: 4MB' );
    //                 return false
    //             } 
    //             else {
    //                 console.log( "in else for error ",response.data );
    //                 // If not the given file type
    //                 alert( response.data.error.message);
    //                 return false
    //             }
    //             } 
    //             else {
    //                 // Success
    //                 let fileName = response.data;
    //                 console.log( 'fileName', fileName.image,fileName.location );
    //                 $('#profileImage').val(fileName.location)
    //                 return false
    //             }
    //         }
    //     })
    //     .catch( ( error ) => {
    //         // If another error
    //         console.log('eror in catch',error)
    //         alert( error);
    //         return false
    //     });
    // }
    // else {
    //     // if file not selected throw error
    //     alert( 'Please upload file' );
    //     result=false
    // }
    //     console.log('in upload images : ',result,$('#profileImage').val())
    //     return false
}