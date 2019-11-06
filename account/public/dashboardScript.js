// Get the modal
var modal = document.getElementById('addimagediv');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
  }
  
function show(val){
  document.getElementById(val).style.display='block'
  return true
}
 
function uploadPicture (id,modalId){
    const file=$(`#${id}`)[0].files[0]
    const type=file.type.split('/')[1]
    if(typeof file==='undefined')
        {
            alert('select a file')
            return false
        }
    if(file.size>=3000000){
        alert('please upload image with size less than 3Mb..')
        return false
    }
    switch (type){
        case 'jpg':
        case 'jpeg':    
        case 'png':
        case 'gif':{
            $('#cload').text('uploading your image please wait..') 
            const modal=document.getElementById('loadModal')  
            $('body').css('text-align','center')
            document.getElementById(modalId).style.display='none'           
            modal.style.display='block'
            return true
         } 
        default :{
            alert("upload image only...")
            return false
        }   
    }
}

function ask_confirm(){
    if ( window.confirm('Are you sure you want to delete this post?')) {
       return  true
    } else {
        return false
    }
}