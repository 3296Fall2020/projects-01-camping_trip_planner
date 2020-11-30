// Check if user is signed in before displaying a profile page
if (getCookie('active') === 'true') {
    // Signed in
    nav_signOut.style.display = "inline";
    nav_profile.style.display = "inline";
    nav_signIn.style.display = "none";
} else {
    // Redirect to login page
    window.location.href="login.html";
}

function createGroupInviteListItem(groupName, inviteFrom, requestUuid) {
    const newListItem = document.createElement('li');
    newListItem.classList.add('list-group-item');

    const textDiv = document.createElement('div');
    textDiv.style.width = '70%';
    textDiv.style.float = 'left';

    const groupNameText = document.createElement('p');
    groupNameText.classList.add('md1');
    groupNameText.innerText = groupName;

    const groupInvitedByText = document.createElement('p');
    groupInvitedByText.classList.add('small');
    groupInvitedByText.style.marginBottom = '0';
    groupInvitedByText.innerText= inviteFrom;

    const buttonDiv = document.createElement('div');
    buttonDiv.style.width = '30%';
    buttonDiv.style.float = 'right';

    const acceptButton = document.createElement('button');
    acceptButton.onclick = function() { acceptGroupInvite(requestUuid, newListItem) };
    acceptButton.innerText = 'Accept';
    acceptButton.classList.add('group-accept-button');
    acceptButton.classList.add('btn');
    acceptButton.classList.add('btn-success');
    acceptButton.classList.add('btn-sm');
    acceptButton.type = 'button';

    const declineButton = document.createElement('button');
    declineButton.onclick = function() { declineGroupInvite(requestUuid, newListItem) };
    declineButton.innerText = 'Decline';
    declineButton.classList.add('group-decline-button');
    declineButton.classList.add('btn');
    declineButton.classList.add('btn-danger');
    declineButton.classList.add('btn-sm');
    declineButton.type = 'button';

    newListItem.appendChild(textDiv);
    textDiv.appendChild(groupNameText);
    textDiv.appendChild(groupInvitedByText);
    newListItem.appendChild(buttonDiv);
    buttonDiv.appendChild(acceptButton);
    buttonDiv.appendChild(declineButton);

    return newListItem;
}

function createGroupListItem(groupName, groupUuid) {
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

async function getGroupRequests() {
    const response = await fetch(serverAddress + '/getGroupInvites', {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow'
    });
    return await response.json();
}

async function getGroupList() {
    const response = await fetch(serverAddress + '/getGroupsByUser', {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow'
    });
    return await response.json();
}

async function acceptGroupInviteRequest(requestUuid) {
    const response = await fetch(serverAddress + '/acceptGroupInvite', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({'request-uuid': requestUuid})
    });
    return await response.json();
}

async function declineGroupInviteRequest(requestUuid) {
    const response = await fetch(serverAddress + '/declineGroupInvite', {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        body: JSON.stringify({'request-uuid': requestUuid})
    });
    return await response.json();
}

function checkGroupInvite() {
    if ($('#group-invite-list').children().length === 0) {
        $("#new-group-requests").hide();
    }
}

function declineGroupInvite(requestUuid, buttonElement) {
    $("#loader").show();
    declineGroupInviteRequest(requestUuid).then(ret => {
        if (ret['status'] === 200) {
            buttonElement.remove();
        }
        console.log(ret);
        checkGroupInvite();
        $("#loader").hide();
    });
}

function acceptGroupInvite(requestUuid, buttonElement) {
    $("#loader").show();
    acceptGroupInviteRequest(requestUuid).then(ret => {
        if (ret['status'] === 200) {
            buttonElement.remove();
        }
        console.log(ret);
        checkGroupInvite();
        generateGroupList();
        $("#loader").hide();
    });
}

async function newGroupPost(data) {
    console.log(data);
    const response = await fetch(serverAddress + '/createGroup', {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        body: JSON.stringify(data)
    });
    return await response.json();
}

function newGroup() {
    $("#loader").show();
    newGroupPost({
        'group-name': document.getElementById('input_user-group-name').value,
    }).then(ret => {
        if (ret['status'] === 200) {
            $('#modal_new-group').modal('hide');
            window.location.reload(true);
        }
        console.log(ret);
        checkGroupInvite();
        $("#loader").hide();
    });
}


function generateGroupList() {
    const groupList = document.getElementById('group-list')
    while (groupList.firstChild) {
        groupList.removeChild(groupList.firstChild);
    }

    getGroupList().then(ret => {
        console.log(ret);
        console.log(ret['status']);
        if (ret['status'] === 200) {
            console.log("Creating group list");
            const groups = ret['groups'];
            console.log(groups);

            for (let i = 0; i < groups.length; i++) {
                document.getElementById('group-list').appendChild(
                    createGroupListItem(groups[i]['group-name'], groups[i]['group-uuid'])
                )
            }
        }
    });
}


$( document ).ready(function() {


    getGroupRequests().then(ret => {
        if (ret['status'] === 200) {
            const invites = ret['invites'];
            console.log(invites);

            if (invites.length > 0) {
                $("#new-group-requests").show();
            }

            for (let i = 0; i < invites.length; i++) {
                document.getElementById('group-invite-list').appendChild(
                    createGroupInviteListItem(invites[i]['group-name'], invites[i]['invite-from'], invites[i]['request-uuid'])
                )
            }
        }
    });

    generateGroupList();

    const name = getCookie("full_name");
    if (name != null) {
        $("#profile-name").text(name);
        // document.getElementById('profile-name').value = name;
    }

    $("#loader").hide();

});


