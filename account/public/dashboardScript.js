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

function handleSideBar() {
    console.log('in side bar handle')
    let sideBarStyle = document.getElementById("mySidebar").style;

    if(sideBarStyle.width === "" || sideBarStyle.width === "0px"){
        //display side bar
        sideBarStyle.width = "30vh";
        sideBarStyle["box-shadow"] =  "rgba(0,0,0,0.55) 45px 0px 50px -55px";
        document.getElementById("main").style.marginLeft = "30vh";
        document.getElementById("openMenuBtn").innerHTML = "<";
    }
    else{
        //hide side bar
        sideBarStyle.width = "0";
        sideBarStyle["box-shadow"] =  null;
        document.getElementById("main").style.marginLeft = "0";
        document.getElementById("openMenuBtn").innerHTML = ">";
    }
}

var dropdown = document.getElementsByClassName("dropdown");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
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