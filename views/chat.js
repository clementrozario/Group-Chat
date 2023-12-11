const apiUrl = 'http://localhost:3000';

function createGroup(event) {
    const token = localStorage.getItem('token');
    event.preventDefault();
    const groupName = event.target.groupName.value;
    axios.post(`${apiUrl}/group/create-group`, { groupName }, { headers: { "Authorization": token } })
        .then(response => {
            alert(response.data.message);
            console.log(response.data.group);
            document.querySelector(".popup").style.display = "none";
            getGroup(response.data.group.groupname, response.data.group.id);
        })
        .catch(err => console.log(err));
}

function getGroup(groups, id) {
    const menuElm = document.getElementById("menu");
    menuElm.innerHTML += `<div class="group" onclick="showGroup(${id})">${groups}</div>`;
}

function showGroup(id) {
    showGroupMessage(id);
    localStorage.setItem("groupId", id);
    const token = localStorage.getItem('token');
    const groupElm = document.getElementById("group");
    groupElm.innerHTML = '';
    axios.get(`${apiUrl}/group/get-group/${id}`, { headers: { "Authorization": token } })
        .then(response => {
            groupElm.innerHTML += `<h2>${response.data.group.groupname}</h2>
                                <button onclick="showParticipants(${response.data.group.id})">Add Participants</button>`;
            const users = response.data.users;
            users.forEach(user => {
                groupElm.innerHTML += `<div>${user.name}</div>`;
            });
        });
}

function showParticipants(groupid) {
    document.querySelector(".popup2").style.display = "flex";
    const usersElm = document.getElementById("participant");
    usersElm.innerHTML = '';
    axios.get(`${apiUrl}/user/show-participants/${groupid}`)
        .then(response => {
            const participants = response.data.users;
            participants.forEach(user => {
                usersElm.innerHTML += `<div><input type="checkbox" name="user" value="${user.id}">${user.name}</div>`;
            });
            usersElm.innerHTML += `<input type="hidden" name="groupid" value="${groupid}">`;
            usersElm.innerHTML += `<button type="submit">Add</button>`;
        });
}

function addParticipant(event) {
    event.preventDefault();
    const groupid = event.target.groupid.value;
    const form = event.target;
    const checkboxes = form.querySelectorAll('input[type="checkbox"][name="user"]:checked');
    const selectedIds = Array.from(checkboxes).map(checkbox => checkbox.value);
    console.log(selectedIds);
    axios.post(`${apiUrl}/group/add-participants/${groupid}`, selectedIds)
        .then(response => {
            if (response.status === 201) {
                alert(response.data.message);
                document.querySelector(".popup2").style.display = "none";
            }
        })
        .catch(err => console.log(err));
}

function showGroupMessage(groupid) {
    const token = localStorage.getItem('token');
    let oldChat = JSON.parse(localStorage.getItem(`localchat${groupid}`)) || [];
    let lastMsgId = oldChat.length > 0 ? oldChat[oldChat.length - 1].id : 0;
    const name = parseJwt(token).name;

    axios.get(`${apiUrl}/chat/get-group-chat/${groupid}?lastmsgid=${lastMsgId}`, { headers: { "Authorization": token } })
        .then((response) => {
            const newMessages = response.data.allMessage;
            chatMessages.innerHTML = '';
            let localChat = oldChat.concat(newMessages);
            if (localChat.length > 10) {
                localChat = localChat.slice(localChat.length - 10);
            }
            localStorage.setItem(`localchat${groupid}`, JSON.stringify(localChat));
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
}
