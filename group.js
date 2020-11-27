const urlParams = new URLSearchParams(window.location.search);
const groupName = decodeURIComponent(urlParams.get('group-name'));
const groupUuid = urlParams.get('group-uuid');

if (getCookie('active') === 'true') {
    // Signed in
    nav_signOut.style.display = "inline";
    nav_profile.style.display = "inline";
    nav_signIn.style.display = "none";
} else {
    window.location.href="login.html";
}

function addUserToGroupList() {
    const groupUserList = document.getElementById('group-user-display');

    createRequest('/getUsersInGroup?group_uuid=' + groupUuid, 'GET').then(ret => {
        if (ret['status'] === 200) {
            // <li class="group-user">ST</li>
            for (let i = 0; i < ret['users'].length; i++) {
                let user = ret['users'][i];
                let listItem = document.createElement('li');
                listItem.classList.add('group-user');
                listItem.textContent = user['first-name'][0] + user['last-name'][0];
                listItem.title = user['first-name'] + ' ' + user['last-name'] + " : " + user['email'];
                listItem.setAttribute('data-toggle', 'tooltip');
                listItem.setAttribute('data-placement', 'top');
                listItem.onclick = function() {
                    displayUserModal(user['first-name'] + ' ' + user['last-name'], user['email']);
                }

                groupUserList.appendChild(listItem);
            }
        }
    })
}

function displayUserModal(name, email) {
    $('#modal_group-user').modal('toggle');
    $('#group-user-modal-name').text(name);
    $('#group-user-modal-email').text(email);
}

async function sendGroupInvitePost(data) {
    const response = await fetch(serverAddress + '/inviteUser', {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        body: JSON.stringify(data)
    });
    return await response.json();
}

function sendGroupInvite() {
    const inviteEmail = document.getElementById('input_inviteEmail').value;

    sendGroupInvitePost({
        'group-uuid': groupUuid,
        'invite-user-email': inviteEmail
    }).then(ret => {
        console.log(ret);
        location.reload(true);
    })
}

function expandTextarea(element) {
    element.style.height = "";
    element.style.height = element.scrollHeight + "px";
}

function renameGroup(newName) {
    createRequest('/renameGroup','POST', {
        'group-uuid': groupUuid,
        'new-name': newName
    }).then(ret => {
        console.log("Changed name");
        console.log(ret);
    })
}

addUserToGroupList();
document.getElementById('group-name-display').value = groupName;