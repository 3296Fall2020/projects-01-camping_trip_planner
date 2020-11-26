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

document.getElementById('group-name-display').textContent = groupName;

async function getLists() {
    const response = await fetch(serverAddress + '/getListsByGroup?group-uuid=' +groupUuid, {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow'
    });
    return await response.json();
}

function createListItem(groupName, groupUuid) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');

    const listTitle = document.createElement('p');
    listTitle.classList.add('md1');
    listTitle.style.marginBottom = '0';

    const listLink = document.createElement('a');
    listLink.href = 'group.html?group-uuid=' + groupUuid + '&group-name=' + groupName;
    listLink.textContent = groupName;

    listTitle.appendChild(listLink);
    listItem.appendChild(listTitle);

    return listItem;
}

$( document ).ready(function() {

    getLists().then(ret => {
        console.log(ret);
        console.log(ret['status']);
        if (ret['status'] === 200) {
            console.log("Creating group page lists");
            const lists = ret['lists'];
            console.log(lists);

            for (let i = 0; i < lists.length; i++) {
                document.getElementById('group-lists').appendChild(
                    createListItem(lists[i]['group-name'], lists[i]['group-uuid'])
                )
            }
        }
    });


});