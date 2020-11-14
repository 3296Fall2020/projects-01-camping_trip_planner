const serverAddress = "http://localhost:5000"

const nav_signIn = document.getElementById('nav_sign-in')
const nav_signOut = document.getElementById('nav_sign-out')
const nav_profile = document.getElementById('nav_profile')


const warning_incorrectPass = document.getElementById('label_incorrect-password');
const warning_recaptchaErrorSignIn = document.getElementById('label_recaptcha-error-signin');
const warning_recaptchaErrorSignUp = document.getElementById('label_recaptcha-error-signup');

const warning_passwordConfirmation = document.getElementById('label__pass_conf');

const input_signupPass = document.getElementById("input_user-pass");
const input_signupPassConf = document.getElementById("input_user-confirm-pass");

let profile;


//--- Check User Login (Session) ---//
async function checkLoginGet() {
    const response = await fetch(serverAddress + '/checkLogin', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5000',
            'Access-Control-Allow-Credentials': 'true'
        }
    });
    return await response.json();
}

checkLoginGet().then(ret => {
    if (ret['status'] === 200) {
        // Signed in
        nav_signOut.style.display = "inline";
        nav_profile.style.display = "inline";
        profile = ret['profile']
        console.log(profile);
        document.getElementById('profile-name').textContent = profile['full_name'];
    } else {
        nav_signIn.style.display = "inline";
    }
});

//--- END Check User Login ---//

//--- Sign In Process ---//
async function signInPost(data) {
    // Make POST request submitting
    // Add CORS header to allow cross origin resource sharing
    const response = await fetch(serverAddress + '/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5000',
            'CORS_SUPPORTS_CREDENTIALS': 'true',
            'Access-Control-Allow-Credentials': 'true'
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
    // const g_recaptcha_response = document.getElementById('g-recaptcha-response').value;
    const g_recaptcha_response = '123';

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
            }
            /*
            if(ret['error'] === 'failed-recaptcha') {
                // recaptcha verification failed
                warning_recaptchaErrorSignIn.style.display = 'inline';
            }
            grecaptcha.reset();  // Refresh captcha
            */
        } else {
            // Logged in successful
            window.location.href="profile.html";
        }
    });
}

//--- End of sign in process ---//


//--- Sign Out Process ---//
async function signOutPost() {
    const response = await fetch(serverAddress + '/logout', {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5000',
            'CORS_SUPPORTS_CREDENTIALS': 'true',
            'Access-Control-Allow-Credentials': 'true'
        },
        credentials: 'include'
    });
    return await response.json();
}

function signOut() {
    signOutPost().then(ret => {
        console.log(ret);
        console.log("signed out");
    })
}

//--- Sign Up Process ---//
function confirmPass() {
    if (input_signupPass.value !== input_signupPassConf.value) {
        warning_passwordConfirmation.style.display = 'inline';
    } else {
        warning_passwordConfirmation.style.display = 'none';
    }
}

async function signUpPost(data) {
    // Make POST request submitting new account
    // Add CORS header to allow cross origin resource sharing
    const response = await fetch(serverAddress + '/signup', {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
    });
    // Wait for response from server, then parse the body of the response in json format
    return await response.json();
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

    signUpPost({
        "first_name": document.getElementById('input_user-first-name').value,
        "last_name": document.getElementById('input_user-last-name').value,
        "email": document.getElementById('input_user-email').value,
        "password": input_signupPass.value,
        "password_conf": input_signupPassConf.value,
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

//--- END SIGN UP PROCESS ---//
