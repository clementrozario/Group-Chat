const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const addPar = document.getElementById('addPar');
const deleteGrp = document.getElementById('deleteGroup');

document.getElementById("groupButton").addEventListener("click", function () {
    document.querySelector(".popup").style.display = "flex";
})
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".popup").style.display = "none";
})
document.querySelector(".close1").addEventListener("click", () => {
    document.querySelector(".popup1").style.display = "none";
})
document.querySelector(".close2").addEventListener("click", () => {
    document.querySelector(".popup2").style.display = "none";
})
document.querySelector(".close3").addEventListener("click", () => {
    document.querySelector(".popup3").style.display = "none";
})
function redirectLogin() {
    window.location.href = "./index.html"
}
// const socket = io();

// socket.on('message', (message) => {
//     displayMessage('name', message)
// })

window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token')
    const decoded = parseJwt(token);
    document.getElementById('userName').textContent = decoded.name;
    axios.get(`http://localhost:3000/group/show-group`, { headers: { "Authorization": token } })
        .then(res => {
            const userGroups = res.data.groups
            userGroups.forEach((group) => {
                getGroup(group.groupname, group.id)
            })
        })
})

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

addPar.addEventListener('click', () => {
    const groupId = localStorage.getItem('groupId')
    showParticipants(groupId);
});

deleteGrp.addEventListener('click', () => {
    const groupId = localStorage.getItem('groupId')
    deleteGroup(groupId);
});

async function uploadFiles(event) {
    event.preventDefault();
    const token = localStorage.getItem('token')
    const groupId = localStorage.getItem('groupId')
    const userId = parseJwt(token).userId
    const name = parseJwt(token).name;
    const fileInput = document.getElementById('file');
    const uploadedfile = fileInput.files[0];

    if (uploadedfile) {
        const formData = new FormData();
        formData.append("file", uploadedfile);
        formData.append("name", name);
        formData.append("userId", userId);
        formData.append("groupId", groupId);
        try {
            await axios.post("http://localhost:3000/chat/add-file", formData)
                .then((response) => {
                    console.log(response.data)
                    displayimage('You', response.data.message);
                })
        } catch (err) {
            console.log(err);
        }
    } else {
        alert("Please select a file");
    }
}

sendButton.addEventListener('click', () => {
    const token = localStorage.getItem('token')
    const groupId = localStorage.getItem('groupId')
    const message = messageInput.value;
    console.log(messageInput.value);
    const userId = parseJwt(token).userId
    const name = parseJwt(token).name;
    const obj = {
        message,
        name,
        userId,
        groupId
    }
    if (message) {
        axios.post("http://localhost:3000/chat/add-chat", obj)
            .then((response) => {
                // socket.emit('user-message', message)
                displayMessage('You', response.data.message);
            })
        messageInput.value = '';
    }
});

function displayimage(sender, text) {
    chatMessages.innerHTML += `<b>${sender}:</b> <img src="${text}" style="width:40vw;height:auto" class="message-text"><br>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function displayMessage(sender, text) {
    chatMessages.innerHTML += `<b>${sender}:</b> ${text}<br>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function createGroup(event) {
    const token = localStorage.getItem('token')
    event.preventDefault();
    const groupName = event.target.groupName.value;
    axios.post("http://localhost:3000/group/create-group", { groupName }, { headers: { "Authorization": token } })
        .then(response => {
            alert(response.data.message)
            console.log(response.data.group)
            document.querySelector(".popup").style.display = "none";
            getGroup(response.data.group.groupname, response.data.group.id)
        }).catch(err => console.log(err))
}

function deleteGroup(groupid) {
    axios.delete(`http://localhost:3000/group/delete-group/${groupid}`)
        .then(response => {
            alert(response.data.message);

        })
}

function getGroup(group, id) {
    const menuElm = document.getElementById("menu")
    menuElm.innerHTML += `<div class="group" onclick="showGroup('${id}')">${group}</div>`
}

function showGroup(id) {
    // socket.emit('join-group', id)
    localStorage.setItem("groupId", id)
    document.getElementById("chat-container").style.display = "block";
    document.querySelector(".main").style.display = "grid";
    document.querySelector(".menu").style.display = "grid";
    document.querySelector(".menu").style.margin = "0";
    const navElement = document.getElementById("groupName");
    navElement.innerText = '';
    showGroupMessage(id);
    const token = localStorage.getItem('token')
    const groupElm = document.getElementById("group")
    groupElm.innerHTML = '';
    axios.get(`http://localhost:3000/group/get-group/${id}`, { headers: { "Authorization": token } })
        .then(response => {
            groupElm.innerHTML += `<h2>${response.data.group.groupname}</h2>
                                <button class="btn1" onclick="showParticipants('${response.data.group.id}')">Add Participants</button>`;
            navElement.innerText += `${response.data.group.groupname}`
            const users = response.data.users;
            users.forEach(user => {
                groupElm.innerHTML += `<div class="group" onclick="showEdits(${user.id},'${id}')">${user.name}</div>`
            })
        })
}

function showEdits(userId, groupId) {
    document.querySelector(".popup2").style.display = "flex";
    const usersElm = document.getElementById("userAction");
    usersElm.innerHTML = '';
    axios.get(`http://localhost:3000/user/get-user-data/${userId}?groupid=${groupId}`)
        .then(response => {
            const userData = response.data.user
            if (userData[0].admin === true) {
                usersElm.innerHTML += `<div class="group" onclick="removeAdmin(${userData[0].userId}, '${userData[0].groupId}')">Dismiss as admin</div><br>`
            } else {
                usersElm.innerHTML += `<div class="group" onclick="makeAdmin(${userData[0].userId}, '${userData[0].groupId}')">Make Admin</div><br>`
            }
            usersElm.innerHTML += `<div class="group" onclick="removeFromGroup(${userData[0].userId}, '${userData[0].groupId}')">remove from group</div>`
        })
}

function showParticipants(groupid) {
    document.querySelector(".popup1").style.display = "flex";
    const usersElm = document.getElementById("addParticipant")
    usersElm.innerHTML = '';
    usersElm.innerHTML += `<input type="hidden" name="groupid" value="${groupid}">`
    // usersElm.innerHTML += `<button class="btn1" type="submit">Add</button>`
}

function addParticipant(event) {
    event.preventDefault();
    const form = event.target;
    const groupId = form.querySelector('input[name="groupid"]').value; // Retrieve groupId from the form
    const checkboxes = form.querySelectorAll('input[type="checkbox"][name="user"]:checked');
    const selectedIds = Array.from(checkboxes).map(checkbox => checkbox.value);
    console.log(selectedIds);
    console.log(groupId);
    axios.post(`http://localhost:3000/group/add-participants/${groupId}`, selectedIds)
        .then(response => {
            if (response.status === 201) {
                alert(response.data.message);
                document.querySelector(".popup1").style.display = "none";
                showGroup(groupId);
            }
        })
        .catch(err => console.log(err));
}


function showGroupMessage(groupid) {
    // socket.on('message', (message) => {
    //     displayMessage('name', message)
    // })
    const token = localStorage.getItem('token')
    let oldChat = JSON.parse(localStorage.getItem(`localchat${groupid}`)) || []
    let lastMsgId = oldChat.length > 0 ? oldChat[oldChat.length - 1].id : 0;
    const name = parseJwt(token).name;
    // setInterval(() => {
    axios.get(`http://localhost:3000/chat/get-group-chat/${groupid}?lastmsgid=${lastMsgId}`, { headers: { "Authorization": token } })
        .then((response) => {
            const newMessages = response.data.allMessage;
            chatMessages.innerHTML = '';
            let localChat = oldChat.concat(newMessages)
            if (localChat.length > 10) {
                localChat = localChat.slice(localChat.length - 10);
            }
            localStorage.setItem(`localchat${groupid}`, JSON.stringify(localChat))
            localChat.forEach((message) => {
                if (message.groupId === groupid) {
                    if (message.name == name) {
                        displayMessage('You', message.message);
                    } else {
                        displayMessage(message.name, message.message);
                    }
                }
            });
        });
    //   }, 1000);
}

function participantFn() {
    const token = localStorage.getItem('token')
    const decoded = parseJwt(token);
    const groupId = localStorage.getItem('groupId')
    document.querySelector(".popup3").style.display = "flex";
    const usersElm = document.getElementById("groupParticipant")
    usersElm.innerHTML = '';
    axios.get(`http://localhost:3000/user/get-participants/${groupId}`, { headers: { "Authorization": token } })
        .then(response => {
            const participants = response.data.users;
            const requestUserisAdmin = response.data.admin;
            if (requestUserisAdmin) {
                participants.forEach(user => {
                    if (user.isAdmin === true) {
                        if (decoded.userId === user.userId) {
                            usersElm.innerHTML += `<div><b>You</b> are Group Admin </div>`
                        } else {
                            usersElm.innerHTML += `<div><b>${user.name}</b> Group Admin 
                        <button class="btn1" onclick="removeAdmin(${user.userId}, '${groupId}')">Remove from Admin</button> </div>`
                        }
                    } else {
                        usersElm.innerHTML += `<div><b>${user.name}</b> <button class="btn1" onclick="makeAdmin(${user.userId}, '${groupId}')">Make Admin</button> </div>`
                    }
                })
            } else {
                participants.forEach(user => {
                    if (user.isAdmin === true) {
                        usersElm.innerHTML += `<div><b>${user.name}</b> Group Admin </div>`
                    } else {
                        usersElm.innerHTML += `<div><b>${user.name}</b></div>`
                    }
                })
            }
            usersElm.innerHTML += `<input type="hidden" name="groupid" value="${groupId}">`
        })
}

function makeAdmin(userId, groupId) {
    const obj = { userId, groupId };
    axios.post(`http://localhost:3000/group/make-admin`, obj)
        .then(response => {
            alert(response.data.message);
            participantFn()
        })
}

function removeAdmin(userId, groupId) {
    const obj = { userId, groupId };
    axios.post(`http://localhost:3000/group/remove-admin`, obj)
        .then(response => {
            alert(response.data.message);
            participantFn()
        })
}

function removeFromGroup(userId, groupId) {
    const obj = { userId, groupId };
    axios.post(`http://localhost:3000/group/remove-from-group`, obj)
        .then(response => {
            console.log(response);
            alert(response.data.message);
            document.querySelector(".popup2").style.display = "none";
            showGroup(groupId)
        })
}

const searchBar = document.getElementById('search');

searchBar.addEventListener('input', event => {
    try {
        const groupId = localStorage.getItem('groupId')
        const searchQuery = event.target.value;;
        const usersElm = document.getElementById("addParticipant")
        axios.get(`http://localhost:3000/admin/search/${groupId}?searchQuery=${searchQuery}`)
            .then(response => {
                const users = response.data.users;
                usersElm.innerHTML = '';
                users.forEach(user => {
                    showSearchedUser(user, usersElm, groupId);
                })
                usersElm.innerHTML += `<button class="btn1" type="submit">Add</button>`
            });
    } catch { err => console.log(err) }
})

function showSearchedUser(user, usersElm, groupId) {
    try{
    usersElm.innerHTML += `<div><input type="checkbox" name="user" value="${user.id}">${user.name}</div>`
    usersElm.innerHTML += `<input type="hidden" name="groupid" value="${groupId}">`
} catch { err => console.log(err) }
}