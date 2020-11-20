const serverAddress = "https://camping.sebtota.com:5000"

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

//--- Sign Out Process ---//
async function signOutPost() {
    const response = await fetch(serverAddress + '/logout', {
        method: 'POST',
        credentials: 'include'
    });
    return await response.json();
}

function signOut() {
    signOutPost().then(ret => {
        console.log(ret);
        console.log("signed out");
        $("#loader").hide();

        sessionStorage.setItem('status', null);
        window.location.href="index.html";
    })
}

$('#nav_sign-out').on('click',function (e){
    e.preventDefault();
    signOut();
});
