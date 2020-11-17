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

async function getGroupRequests() {
    const response = await fetch(serverAddress + '/getGroupInvites', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5000',
            'Access-Control-Allow-Credentials': 'true'
        }
    });
    return await response.json();
}

async function acceptGroupInviteRequest(requestUuid) {
    const response = await fetch(serverAddress + '/acceptGroupInvite', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5000',
            'Access-Control-Allow-Credentials': 'true'
        },
        body: JSON.stringify({'request-uuid': requestUuid})
    });
    return await response.json();
}

async function declineGroupInviteRequest(requestUuid) {
    const response = await fetch(serverAddress + '/declineGroupInvite', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5000',
            'Access-Control-Allow-Credentials': 'true'
        },
        body: JSON.stringify({'request-uuid': requestUuid})
    });
    return await response.json();
}

function declineGroupInvite(requestUuid, buttonElement) {
    $("#loader").show();
    declineGroupInviteRequest(requestUuid).then(ret => {
        if (ret['status'] === 200) {
            buttonElement.remove();
        }
        console.log(ret);
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
        $("#loader").hide();
    });
}

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