
function checkForm(form)
  {
    if(form.username.value == "") {
      alert("Error: Username cannot be blank!");
      form.username.focus();
      return false;
    }
    re = /^\w+$/;
    if(!re.test(form.username.value)) {
      alert("Error: Username must contain only letters, numbers and underscores!");
      form.username.focus();
      return false;
    }
    if(!form.email.value.includes("@")) {
      alert("Error: email is not right format !");
      form.email.focus();
      return false;
    }
    if(form.password.value != "" && form.password.value == form.Cpassword.value) {
      if(form.password.value.length < 6) {
        alert("Error: Password must contain at least six characters!");
        form.password.focus();
        return false;
      }
      if(form.password.value == form.username.value) {
        alert("Error: Password must be different from Username!");
        form.password.focus();
        return false;
      }
      re = /[0-9]/;
      if(!re.test(form.password.value)) {
        alert("Error: password must contain at least one number (0-9)!");
        form.password.focus();
        return false;
      }
      re = /[a-z]/;
      if(!re.test(form.password.value)) {
        alert("Error: password must contain at least one lowercase letter (a-z)!");
        form.password.focus();
        return false;
      }
      re = /[A-Z]/;
      if(!re.test(form.password.value)) {
        alert("Error: password must contain at least one uppercase letter (A-Z)!");
        form.password.focus();
        return false;
      }
    } else {
      alert("Error: Please check that you've entered and confirmed your password!");
      form.password.focus();
      return false;
    }

    alert("You entered a valid password");
    const t=parseInt(Date.now())
    document.getElementById('date').value=t
    return true;
}

function signupUser(){
  const Cpassword = document.getElementById('CpasswordSign')
  const password = document.getElementById('passwordSign')
  const email = document.getElementById('emailSign')
  const username = document.getElementById('usernameSign')
  const form={
    Cpassword:Cpassword,
    password:password,
    email:email,
    username:username
  }
  if(checkForm(form)){ 
    document.getElementById('date').value
    document.getElementById('id02').style.display='none'
    $.ajax({
      url: '/signup', 
      type: 'POST', 
      contentType: 'application/json', 
      data: JSON.stringify({
        Cpassword:Cpassword.value,
        password:password.value,
        email:email.value,
        username:username.value,
        date:date.value
      })}
      )
    .then(msg=>alert(msg))
  }
}
  
// Get the modal
var modal1 = document.getElementById('id01');
var modal2 = document.getElementById('id02');
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal1) {
        modal1.style.display = "none";
    }

    if (event.target == modal2) {
        modal2.style.display = "none";
    }
}