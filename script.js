const serverAddress = "https://api2.sebtota.com:5000"

const warning_incorrectPass = document.getElementById('label_incorrect-password');
const warning_recaptchaErrorSignIn = document.getElementById('label_recaptcha-error-signin');
const warning_recaptchaErrorSignUp = document.getElementById('label_recaptcha-error-signup');

const warning_passwordConfirmation = document.getElementById('label__pass_conf');

const input_signupPass = document.getElementById("userPassword");
const input_signupPassConf = document.getElementById("userConfirmPassword");


if(1 === 1) {
    document.getElementById('nav_profile').style.display = "inline";
}

async function apiCallGet(url){
    // Make api call and wait for response before returning
    // Add CORS header to allow cross origin resource sharing
    const response = await fetch(url, {
        mode: 'cors',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    });
    return await response.json();
}

function buttonClickGet() {
    apiCallGet("http://localhost:5000/home").then(ret => {
        alert(ret['name']);
    });
}

async function getIpAddress() {
    const response = await fetch('https://api.ipify.org/?format=json', {
        mode: 'no-cors',
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
    });
    return await response.json();
}

//--- Sign In Process ---//
async function signInPost(data) {
    // Make POST request submitting
    // Add CORS header to allow cross origin resource sharing
    const response = await fetch(serverAddress + '/login', {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
    });
    // Wait for response from server, then parse the body of the response in json format
    return await response.json();
}

function signIn() {
    // Reset sign in warnings
    warning_incorrectPass.style.display = 'none';
    warning_recaptchaErrorSignIn.style.display = 'none';

    // Get recaptcha response
    const g_recaptcha_response = document.getElementById('g-recaptcha-response').value;

    // Don't process request unless recaptcha is complete
    if (g_recaptcha_response === '') {
        warning_recaptchaErrorSignIn.style.display = 'inline';
        return;
    }

    // Get client IP address for robust recaptcha verification
    /*const ip_address = getIpAddress().then(ret => {
        console.log(ret);
        return ret;
    })*/

    signInPost({
        "email": document.getElementById('input_email').value,
        "password": document.getElementById('input_password').value,
        "recap_response": g_recaptcha_response
    }).then(ret => {
        if (ret['status'] === 401) {
            // Unauthorized error
            if (ret['error'] === 'incorrect-password') {
                // Incorrect password
                // Show incorrect password indicator
                warning_incorrectPass.style.display = 'inline';
            } else if(ret['error'] === 'failed-recaptcha') {
                // recaptcha verification failed
                warning_recaptchaErrorSignIn.style.display = 'inline';
            }
            grecaptcha.reset();  // Refresh captcha
        } else {
            // Logged in successful
            window.location.href="profile.html";
        }
    });
}

//--- End of sign in process ---//



//--- Sign Up process ---//

function confirmPass() {
    if (input_signupPass.value !== input_signupPassConf.value) {
        warning_passwordConfirmation.style.display = 'inline';
    } else {
        warning_passwordConfirmation.style.display = 'none';
    }
}

//check if forms are valid
function validateForm() {
    let firstName = document.getElementById("userFirstName").value;
    let lastName = document.getElementById("userLastName").value;
    let email = document.getElementById("userEmail").value;

    if (firstName == "") {
        alert("First name must be filled out");
        return false;
    }
    if (lastName == "") {
        alert("Last name must be filled out");
        return false;
    }
    if (email == "") {
        alert("Email must be filled out");
        return false;
    }
    if (document.getElementById("userPassword").value  == "") {
        alert("Password must be filled out");
        return false;
    }
    if (document.getElementById("userConfirmPassword").value  == "") {
        alert("Please confirm password");
        return false;
    }

    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (reg.test(email) == false)
    {
        alert('Invalid Email Address');
        return false;
    }

    signUp();
}


function signUp() {
    // Reset sign in warnings
    warning_recaptchaErrorSignUp.style.display = 'none';

    // Get recaptcha response
    const g_recaptcha_response = document.getElementById('g-recaptcha-response-1').value;

    // Don't process request unless recaptcha is complete
    if (g_recaptcha_response === '') {
        warning_recaptchaErrorSignUp.style.display = 'inline';
        return;
    }
}



