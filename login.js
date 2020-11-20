if (sessionStorage.getItem('status') != null) {
    // Signed in
    nav_signOut.style.display = "inline";
    nav_profile.style.display = "inline";
    nav_signIn.style.display = "none";
} else {
    window.location.href="login.html";
}

const urlParams = new URLSearchParams(window.location.search);
const signupCheck = urlParams.get('signup');

if (signupCheck === 'true') {
    $('#modal_sign-up').modal('toggle');
}