

//DataTable = dt;

const urlParams = new URLSearchParams(window.location.search);
const groupName = decodeURIComponent(urlParams.get('group-name'));
const groupUuid = urlParams.get('group-uuid');

let listUuid;

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

async function getElements() {

    const response = await fetch(serverAddress + '/getElementsByList?list-uuid=' +listUuid, {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow'
    });
    return await response.json();
}

function createListItem(item) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-item');
    listItem.textContent = item;

    const listTitle = document.createElement('p');
    listTitle.classList.add('md1');
    listTitle.style.marginBottom = '0';

    listItem.appendChild(listTitle);

    return listItem;
}

$( document ).ready(function() {

    getLists().then(ret => {
        console.log(ret);
        console.log(ret['status']);
        if (ret['status'] === 200) {
            console.log("Creating group page lists");
           // const lists = ret['lists'];
           // console.log(lists);

            const lists = ret['lists'];
            console.log(lists);

            listUuid = lists[0]['list-id'];
            //print(listUuid);

            //populate individual list
            getElements().then(ret => {
                console.log(ret);
                console.log(ret['status']);
                if (ret['status'] === 200) {
                    console.log("Creating list display");
                }
                const elements = ret['elements'];
                console.log(elements);

                $("single-list-entry").append("<ul></ul>");

                let dataSet = [];

                console.log(139);
                for (let i = 0; i < elements.length; i++) {
                    dataSet.push([elements[i]['item-name'], elements[i]['item-quantity'],  elements[i]['item-cost'], elements[i]['item-description'], elements[i]['item-status']]);
                    console.log(dataSet);
                    console.log(143);
                }
                console.log(144);

                $(document).ready(function() {
                    $('#data-table').DataTable( {
                        data: dataSet,
                        'columnDefs': [{
                            'targets': 0,
                            "width": "20%",
                            'searchable':false,
                            'orderable':false,
                            'className': 'dt-body-center',
                            'render': function (data, type, full, meta){
                                return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(data).html() + '">';
                            }

                        }],
                        columns: [
                            { title: "Item Name" },
                            { title: "Quantity" },
                            { title: "Price" },
                            { title: "Description." },
                            { title: "Status" },
                        ]
                    } );
                } );

            });
        }
    });


});