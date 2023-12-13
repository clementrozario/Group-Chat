const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const addPar = document.getElementById('addPar');
const deleteGrp = document.getElementById('deleteGroup');

document.getElementById("groupButton").addEventListener("click", () => {
    document.querySelector(".popup").style.display = "flex";
});

document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".popup").style.display = "none";
});

document.querySelector(".close1").addEventListener("click", () => {
    document.querySelector(".popup1").style.display = "none";
});

document.querySelector(".close2").addEventListener("click", () => {
    document.querySelector(".popup2").style.display = "none";
});

document.querySelector(".close3").addEventListener("click", () => {
    document.querySelector(".popup3").style.display = "none";
});

function redirectLogin() {
    window.location.href = "./login.html";
}

window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    const decoded = parseJwt(token);
    document.getElementById('userName').textContent = decoded.name;

    axios.get("http://localhost:3000/group/show-group", { headers: { "Authorization": token } })
        .then(res => {
            const userGroups = res.data.groups;
            userGroups.forEach(group => {
                getGroup(group.groupname, group.id);
            });
        });
});

addPar.addEventListener('click', () => {
    const groupId = localStorage.getItem('groupId');
    showParticipants(groupId);
});

deleteGrp.addEventListener('click', () => {
    const groupId = localStorage.getItem('groupId');
    deleteGroup(groupId);
});

sendButton.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    const groupId = localStorage.getItem('groupId');
    const message = messageInput.value;
    const userId = parseJwt(token).userId;
    const name = parseJwt(token).name;
    const obj = { message, name, userId, groupId };

    if (message) {
        axios.post("http://localhost:3000/chat/add-chat", obj)
            .then(response => {
                displayMessage('You', response.data.message);
            });

        messageInput.value = '';
    }
});

function displayMessage(sender, text) {
    chatMessages.innerHTML += `<b>${sender}:</b> ${text}<br>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function createGroup(event) {
    const token = localStorage.getItem('token');
    event.preventDefault();
    const groupName = event.target.groupName.value;

    axios.post("http://localhost:3000/group/create-group", { groupName }, { headers: { "Authorization": token } })
        .then(response => {
            alert(response.data.message);
            document.querySelector(".popup").style.display = "none";
            getGroup(response.data.group.groupname, response.data.group.id);
        })
        .catch(err => console.log(err));
}

function deleteGroup(groupid) {
    axios.delete(`http://localhost:3000/group/delete-group/${groupid}`)
        .then(response => {
            alert(response.data.message);
        })
        .catch(err => console.log(err));
}

function getGroup(group, id) {
    const menuElm = document.getElementById("menu");
    menuElm.innerHTML += `<div class="group" onclick="showGroup(${id})">${group}</div>`;
}

function showGroup(id) {
    // Assuming `socket` is declared and connected to the Socket.IO server

    socket.on('message', (message) => {
        displayMessage('name', message);
    });

    showGroupMessage(id);

    localStorage.setItem("groupId", id);
    document.getElementById("chat-container").style.display = "block";
    document.querySelector(".main").style.display = "grid";
    document.querySelector(".menu").style.display = "grid";
    document.querySelector(".menu").style.margin = "0";

    const navElement = document.getElementById("groupName");
    navElement.innerText = '';
    showGroupMessage(id);

    const token = localStorage.getItem('token');
    const groupElm = document.getElementById("group");
    groupElm.innerHTML = '';

    axios.get(`http://localhost:3000/group/get-group/${id}`, { headers: { "Authorization": token } })
        .then(response => {
            groupElm.innerHTML += `<h2>${response.data.group.groupname}</h2>
                                <button class="btn1" onclick="showParticipants(${response.data.group.id})">Add Participants</button>`;
            navElement.innerText += `${response.data.group.groupname}`;

            const users = response.data.users;
            users.forEach(user => {
                groupElm.innerHTML += `<div class="group" onclick="showEdits(${user.id},${id})">${user.name}</div>`;
            });
        })
        .catch(error => {
            console.error('Error fetching group information:', error);
        });
}

function showParticipants(groupid) {
    document.querySelector(".popup1").style.display = "flex";
    const usersElm = document.getElementById("addParticipant");
    usersElm.innerHTML = '';

    axios.get(`http://localhost:3000/user/show-participants/${groupid}`)
        .then(response => {
            const participants = response.data.users;
            participants.forEach(user => {
                usersElm.innerHTML += `<div><input type="checkbox" name="user" value="${user.id}">${user.name}</div>`;
            });

            usersElm.innerHTML += `<input type="hidden" name="groupid" value="${groupid}">`;
            usersElm.innerHTML += `<button class="btn1" type="submit">Add</button>`;
        });
}

function addParticipant(event) {
    event.preventDefault();
    const groupid = event.target.groupid.value;
    const form = event.target;
    const checkboxes = form.querySelectorAll('input[type="checkbox"][name="user"]:checked');
    const selectedIds = Array.from(checkboxes).map(checkbox => checkbox.value);

    axios.post(`http://localhost:3000/group/add-participants/${groupid}`, selectedIds)
        .then(response => {
            if (response.status === 201) {
                alert(response.data.message);
                document.querySelector(".popup2").style.display = "none";
                document.querySelector(".popup1").style.display = "none";
                showGroup(groupid);
            }
        })
        .catch(err => console.log(err));
}

function showGroupMessage(groupid) {
    const token = localStorage.getItem('token');
    let oldChat = JSON.parse(localStorage.getItem(`localchat${groupid}`)) || [];
    let lastMsgId = oldChat.length > 0 ? oldChat[oldChat.length - 1].id : 0;
    const name = parseJwt(token).name;

    axios.get(`http://localhost:3000/chat/get-group-chat/${groupid}?lastmsgid=${lastMsgId}`, { headers: { "Authorization": token } })
        .then(response => {
            const newMessages = response.data.allMessage;
            chatMessages.innerHTML = '';
            let localChat = oldChat.concat(newMessages);

            if (localChat.length > 10) {
                localChat = localChat.slice(localChat.length - 10);
            }

            localStorage.setItem(`localchat${groupid}`, JSON.stringify(localChat));

            localChat.forEach(message => {
                if (message.groupId === groupid && message.name === name) {
                    displayMessage('You', message.message);
                }
            });
        });
}

function showEdits(userId, groupId) {
    document.querySelector(".popup2").style.display = "flex";
    const usersElm = document.getElementById("userAction");
    usersElm.innerHTML = '';

    axios.get(`http://localhost:3000/user/get-user-data/${userId}?groupid=${groupId}`)
        .then(response => {
            const userData = response.data.user;
            if (userData[0].admin === true) {
                usersElm.innerHTML += `<div class="group" onclick="removeAdmin(${userData[0].userId}, ${userData[0].groupId})">Dismiss as admin</div><br>`;
            } else {
                usersElm.innerHTML += `<div class="group" onclick="makeAdmin(${userData[0].userId}, ${userData[0].groupId})">Make Admin</div><br>`;
            }
            
            usersElm.innerHTML += `<div class="group" onclick="removeFromGroup(${userData[0].userId}, ${userData[0].groupId})">remove from group</div>`;
        });
}

function participantFn() {
    const token = localStorage.getItem('token');
    const decoded = parseJwt(token);
    const groupId = localStorage.getItem('groupId');
    document.querySelector(".popup3").style.display = "flex";
    const usersElm = document.getElementById("groupParticipant");
    usersElm.innerHTML = '';

    axios.get(`http://localhost:3000/user/get-participants/${groupId}`)
        .then(response => {
            const participants = response.data.users;

            participants.forEach(user => {
                if (user.isAdmin === 1) {
                    if (decoded.userId === user.userId) {
                        usersElm.innerHTML += `<div>You are Admin </div>`;
                    } else {
                        usersElm.innerHTML += `<div>${user.name} Admin 
                            <button class="btn1" onclick="removeAdmin(${user.userId}, ${groupId})">Remove from Admin</button> </div>`;
                    }
                } else {
                    usersElm.innerHTML += `<div>${user.name} <button class="btn1" onclick="makeAdmin(${user.userId}, ${groupId})">Make Admin</button> </div>`;
                }
            });

            usersElm.innerHTML += `<input type="hidden" name="groupid" value="${groupId}">`;
        });
}

function makeAdmin(userId, groupId) {
    const obj = { userId, groupId };
    axios.post(`http://localhost:3000/group/make-admin`, obj)
        .then(response => {
            alert(response.data.message);
            participantFn();
        });
}

function removeAdmin(userId, groupId) {
    const obj = { userId, groupId };
    axios.post(`http://localhost:3000/group/remove-admin`, obj)
        .then(response => {
            alert(response.data.message);
            participantFn();
        });
}

function removeFromGroup(userId, groupId) {
    const obj = { userId, groupId };
    axios.post(`http://localhost:3000/group/remove-from-group`, obj)
        .then(response => {
            alert(response.data.message);
            document.querySelector(".popup2").style.display = "none";
            showGroup(groupId);
        });
}
