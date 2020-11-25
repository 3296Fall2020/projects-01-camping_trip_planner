const serverAddress = "https://camping.sebtota.com"

const nav_signIn = document.getElementById('nav_sign-in')
const nav_signOut = document.getElementById('nav_sign-out')
const nav_profile = document.getElementById('nav_profile')

const warning_incorrectPass = document.getElementById('label_incorrect-password');
const warning_recaptchaErrorSignIn = document.getElementById('label_recaptcha-error-signin');
const warning_recaptchaErrorSignUp = document.getElementById('label_recaptcha-error-signup');

const warning_passwordConfirmation = document.getElementById('label__pass_conf');

const input_signupPass = document.getElementById("input_user-pass");
const input_signupPassConf = document.getElementById("input_user-confirm-pass");

// Split and iterate over the cookie string, returning the cookie value if found
function getCookie(cookieName) {
    const cookies = document.cookie.split("; ");

    // Iterate over every cookie in the cookie string
    for (let i = 0; i < cookies.length; i++) {
        let cookieObj = cookies[i].split("=");
        if (cookieObj[0] === cookieName) {
            // Remove double quotes from string if they exist
            let retCookie = cookieObj[1];
            if (retCookie[0] === '"') {
                return retCookie.substring(1, retCookie.length - 1);
            } else {
                return retCookie;
            }
        }
    }

    // No cookie found with that name
    return null;
}

//--- Sign Out Process ---//
async function signOutPost() {
    const response = await fetch(serverAddress + '/logout', {
        method: 'POST',
        redirect: 'follow',
        credentials: 'include'
    });
    return await response.json();
}

function signOut() {
    signOutPost().then(ret => {
        console.log(ret);
        console.log("signed out");
        $("#loader").hide();

        window.location.href="index.html";
    })
}

$('#nav_sign-out').on('click',function (e){
    e.preventDefault();
    signOut();
});
