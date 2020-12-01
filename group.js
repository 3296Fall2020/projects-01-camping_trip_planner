//DataTable = dt;
const urlParams = new URLSearchParams(window.location.search);
const groupName = decodeURIComponent(urlParams.get('group-name'));
const groupUuid = urlParams.get('group-uuid');


let listUuid;
let listCount;
let selectedItem;
let elementUuid;

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

async function newListPost(data) {
    const response = await fetch(serverAddress + '/createList?group-uuid=\' +groupUuid', {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        body: JSON.stringify(data)
    });
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

//return list elements from db
async function getElements() {

    const response = await fetch(serverAddress + '/getElementsByList?list-uuid=' +listUuid, {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow'
    });
    return await response.json();
}

//create list item
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

//get the div id for the table we are currently rendering
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

//db add new item
async function newItemPost(data) {
    console.log(data);
    const response = await fetch(serverAddress + '/addElementToList', {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        body: JSON.stringify(data)
    });
    return await response.json();
}

//adding new item
function addNewItem(){
    newItemPost({
        'list-id' : document.getElementById('list-id').value,

        'element-name' : document.getElementById('input_user-item-name').value,
        'element-description' : document.getElementById('input_user-item-description').value,
        'element-quantity' : document.getElementById('input_user-item-quantity').value,
        'element_cost': document.getElementById('input_user-item-cost').value,
        'element-user-id' : 100,
        'element_status': document.getElementById('input_user-item-status').value

    }).then(ret => {
        if (ret['status'] === 400) {
        }
        else{
            $('#modal_new-item').modal('hide');
            //let temp = [];
            //temp.push(['element-name'],['element-quantity' ],['element_cost'], ['element-description'], ['element_status'],  ]);
            //return temp;
            window.location.reload(true);
        }
    });
}

//adding item modal
function addItemModal(listId){
    document.getElementById('list-id').value = listId;
    $('#modal_add-item').modal('show');
}

//db delete list
async function deleteListPost(data) {
    console.log(data);
    const response = await fetch(serverAddress + '/deleteList', {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        body: JSON.stringify(data)
    });
    return await response.json();
}


function deleteList(){
    deleteListPost({
        'list-uuid' : document.getElementById('list-uuid').value,
    }).then(ret => {
        if (ret['status'] === 400) {
        }
        else{
            $('#modal_new-item').modal('hide');
            window.location.reload(true);
        }
    });
}

//db delete Item
async function deleteItemPost() {
    console.log("250 " + elementUuid);
    const response = await fetch(serverAddress + '/deleteElementFromList?element-uuid=' +elementUuid, {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
    });
    // Wait for response from server, then parse the body of the response in json format
    return await response.json();
}

//deleteItem
function deleteItem(elementId){
    deleteItemPost({
        "element-uuid" : elementId
    }).then(ret => {
        if (ret['status'] === 400) {
        }
        else{
        }
    });
}

//db edit  item
async function editItemPost(data) {
    console.log(data);
    const response = await fetch(serverAddress + '/addElementToList', {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow',
        body: JSON.stringify(data)
    });
    // Wait for response from server, then parse the body of the response in json format
    return await response.json();
}

//editing item
function editItem(){
    console.log(291);
    newItemPost({
        'list-id' : document.getElementById('edit-list-id').value,

        'element-name' : document.getElementById("edit-item-name").value,
        'element-description' : document.getElementById('edit-item-description').value,
        'element-quantity' : document.getElementById("edit-item-quantity").value,
        'element_cost': document.getElementById('edit-item-cost').value,
        'element-user-id' : 100,
        'element_status': document.getElementById('edit-item-status').value

    }).then(ret => {
        if (ret['status'] === 400) {
        }
        else{
            deleteItem(selectedItem[5]);
            window.location.reload(true);
        }
    });
}



//show modal to edit selected item
function editItemModal(listId, elementId){
    document.getElementById('edit-list-id').value = listId;

    document.getElementById("edit-item-name").value = selectedItem[0];
    document.getElementById("edit-item-quantity").value = selectedItem[1];
    document.getElementById("edit-item-cost").value = selectedItem[2];
    document.getElementById("edit-item-description").value = selectedItem[3];
    document.getElementById("edit-item-status").value = selectedItem[4];

    document.getElementById( "edit-element-id").value = selectedItem[5];
    $("#edit-item-modal").modal('show');
}

//show modal to confirm list deletion
function deleteListModal(listId){
    document.getElementById('list-uuid').value = listId;
    $('#modal_delete_list').modal('show');
}

//render a single table
function renderTable(tableDivId, temp, listId, listUuid){
    getElements().then(ret => {
        console.log(ret);
        console.log(ret['status']);
        if (ret['status'] === 200) {
            console.log("Creating list display");

            const elements = ret['elements'];
            console.log(elements);

            let dataSet = [];

            for (let i = 0; i < elements.length; i++) {
                dataSet.push([elements[i]['item-name'], elements[i]['item-quantity'], elements[i]['item-cost'], elements[i]['item-description'], elements[i]['item-status'], elements[i]["item-uuid"]]);
                console.log(dataSet);
            }

            let headerDiv = tableDivId.concat("Header");
            headerDiv = headerDiv.substr(1, headerDiv.length);
            document.getElementById(headerDiv).textContent = temp;

            $(document).ready(function () {

                $(tableDivId).DataTable({
                    data: dataSet,
                    select: {
                        style: 'single'
                    },
                    'columnDefs': [{
                        order: [[1, 'asc']]
                    }],
                    columns: [
                        {title: "Item Name", width: '120px'},
                        {title: "Quantity", width: '100px'},
                        {title: "Price", width: '100px'},
                        {title: "Description", width: '200px'},
                        {title: "Bought (T/F)", width: '70px'},
                        { "visible": false, "targets": 6 }
                    ],
                    /* "initComplete": function(oSettings) {
                         $(this).on('click', "i.fa.fa-minus-square", function(e) {
                             table.row( $(this).closest('tr') ).remove().draw();});},*/
                    dom: 'Bfrtip',
                    buttons: [
                        {
                            text: 'Add item',
                            action: function ( e, dt, node, config ) {
                                addItemModal(listId);
                            }
                        },
                        {
                            text: 'Edit item',
                            action: function ( e, dt, node, config ) {
                                selectedItem = $.map(this.row('.selected').data(), function (item) {
                                    console.log("Item " + item);
                                    return item
                                });
                                elementUuid = selectedItem[5];
                                if(this.rows( '.selected' ).any()) {
                                    editItemModal(listId, selectedItem[5], this);
                                    this.row('.selected').remove().draw(false);
                                }
                            }
                        },
                        {
                            text: 'Delete item',
                            action: function ( e, dt, node, config ) {
                                selectedItem = $.map(this.row('.selected').data(), function (item) {
                                    console.log("Item " + item);
                                    return item
                                });
                                elementUuid = selectedItem[5];
                                deleteItem(selectedItem[5]);
                                this.row('.selected').remove().draw( false );
                            }
                        },
                        {
                            text: 'Delete List',
                            action: function ( e, dt, node, config ) {
                                //alert( 'Button activated' );
                                deleteListModal(listUuid);
                            }
                        }
                    ]
                });
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
                listUuid = lists[j]['list-uuid'];

                console.log(lists[j]['list-name']);
                let listId = lists[j]['list-id'];
                let listName = lists[j]['list-name'];
                renderTable(getTableDivId(j), listName , listId, listUuid);
            }
        }
    });


});

