/*

jQuery(function ($) {
    $('#form').validate({
        rules: {
            email: {
                required: true,
                minlength: 6,
                email: true
            },
            username: {
                required: true,
                minlength: 2,
                maxlength: 20,
                lettersonly: true
            },
            passowrd: {
                required: true,
                minlength: 4,
                maxlength: 20,
                nowhitespace: true
            },
            Cpassowrd: {
                equalTo:'#password'
            },
            gender: {
                required: true
            },
        },
        messages: {
            
            email: {
                required: "Please enter your email address",
                minlength: "Password should be more than 6 characters",
                email: "Please enter a valid email address"
            },
            username: {
                required: "Please enter your username",
                minlength: "Name should be more than 2 characters",
                maxlength: "Name should be less than 20 characters",
                lettersonly: "Name should contain only letters"
            },
            passowrd:{
                required: "please enter your password",
                minlength: "Password should be more than 4 characters",
                maxlength: "password should be less than 20 characters",
                lettersonly: "Password should contain only letters"
            },
            gender: {
                equalTo:"passwords don't match"
            },
            Cpassowrd:{
                depends: "password doesn't matches with confirmed password"
            },
        },
    });
});
*/


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

    alert("You entered a valid password: " + form.password.value);
    return true;
  }
