if (sessionStorage.getItem('status') != null) {
    window.location.href="profile.html";
}

const urlParams = new URLSearchParams(window.location.search);
const signupCheck = urlParams.get('signup');

if (signupCheck === 'true') {
    $('#modal_sign-up').modal('toggle');
}