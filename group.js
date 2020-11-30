

//DataTable = dt;

const urlParams = new URLSearchParams(window.location.search);
const groupName = decodeURIComponent(urlParams.get('group-name'));
const groupUuid = urlParams.get('group-uuid');

let listUuid;
let listCount;

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


async function newListPost(data) {
    // Make POST request submitting new account
    // Add CORS header to allow cross origin resource sharing
    const response = await fetch(serverAddress + '/createList?group-uuid=\' +groupUuid', {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        body: JSON.stringify(data)
    });
    // Wait for response from server, then parse the body of the response in json format
    return await response.json();
}

function createNewList() {

    if(listCount === 5){
        alert( 'Please consider a pro membership if you would like to have more than 5 lists :)');
        return;
    }

    newListPost({
        "name": document.getElementById('input_user-list-name').value,
        "group-uuid": groupUuid
    }).then(ret => {
        if (ret['status'] === 400) {
        }
        else{
            $('#modal_new-list').modal('hide');
            window.location.reload(true);
        }
    });
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

function getTableDivId(num){
   switch(num) {
        case num = 0:
            return "#data-table1"
        case num = 1:
            return "#data-table2"
        case num = 2:
            return "#data-table3"
        case num = 3:
            return "#data-table4"
        case num = 4:
            return "#data-table5"
    }
}


//render a single table
function renderTable(tableDivId, temp){
    getElements().then(ret => {
        console.log(ret);
        console.log(ret['status']);
        if (ret['status'] === 200) {
            console.log("Creating list display");

            const elements = ret['elements'];
            console.log(elements);

            let dataSet = [];

            for (let i = 0; i < elements.length; i++) {
                dataSet.push([0, elements[i]['item-name'], elements[i]['item-quantity'], elements[i]['item-cost'], elements[i]['item-description'], elements[i]['item-status']]);
                console.log(dataSet);
            }

            let headerDiv = tableDivId.concat("Header");
            headerDiv = headerDiv.substr(1, headerDiv.length);
            document.getElementById(headerDiv).textContent = temp;

            $(document).ready(function () {
                $(tableDivId).DataTable({
                    data: dataSet,
                    'columnDefs': [{
                        'targets': 0,
                        "width": "20%",
                        'searchable': false,
                        'orderable': false,
                        'className': 'dt-body-center',
                        'render': function (data, type, full, meta) {
                            return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(data).html() + '">';
                        },
                        order: [[1, 'asc']]

                    }],
                    columns: [
                        {title: " ", width: '50px'},
                        {title: "Item Name", width: '120px'},
                        {title: "Quantity", width: '100px'},
                        {title: "Price", width: '100px'},
                        {title: "Description", width: '200px'},
                        {title: "Status"},
                    ],
                    dom: 'Bfrtip',
                    buttons: [
                        {
                            text: 'Add item',
                            action: function ( e, dt, node, config ) {
                                alert( 'Button activated' );
                            }
                        }
                    ]
                });
                //$("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
            });
        }
    });
}


$( document ).ready(function() {
    //get the lists belonging to this group
    getLists().then(ret => {
        console.log(ret);
        console.log(ret['status']);
        if (ret['status'] === 200) {
            console.log("Creating group page lists");
            const lists = ret['lists'];
            console.log(lists);
            listCount = lists.length;

            //populate individual list
            for(let j = 0; j < lists.length; j++)
            {
                listUuid = lists[j]['list-id'];
                console.log(lists[j]['list-name']);
                renderTable(getTableDivId(j), lists[j]['list-name']);
            }
        }
    });


});

