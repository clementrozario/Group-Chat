document.addEventListener("DOMContentLoaded", () => {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    const apiUrl = 'http://localhost:3000'; // Update this with the correct address of your backend API

    const token = localStorage.getItem('token');
    let oldChat = JSON.parse(localStorage.getItem('localchat')) || [];
    let lastMsgId = oldChat.length > 0 ? oldChat[oldChat.length - 1].id : 0;

    const decoded = parseJwt(token);
    document.getElementById('userName').textContent = decoded.name;

    sendButton.addEventListener('click', () => {
        const userId = localStorage.getItem('userId');
        const message = messageInput.value;
        const name = parseJwt(token).name;
        const obj = {
            message,
            name,
            userId
        };

        if (message) {
            axios.post(`${apiUrl}/chat/add-chat`, obj)
                .then((response) => {
                    displayMessage('You', response.data.message);
                    messageInput.value = '';
                })
                .catch((error) => {
                    console.error('Error adding chat:', error);
                });
        }
    });

    function displayMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function updateChat() {
        axios.get(`${apiUrl}/chat/get-chat?lastmsgid=${lastMsgId}`, { headers: { "Authorization": token } })
            .then((response) => {
                const newMessages = response.data.allMessage;
                newMessages.forEach((message) => {
                    displayMessage('You', message.message);
                });

                oldChat = oldChat.concat(newMessages);
                if (oldChat.length > 10) {
                    oldChat = oldChat.slice(oldChat.length - 10);
                }

                localStorage.setItem('localchat', JSON.stringify(oldChat));
                console.log(oldChat);

                chatMessages.innerHTML = '';
                oldChat.forEach((message) => {
                    displayMessage(message.name, message.message);
                });

                lastMsgId = oldChat.length > 0 ? oldChat[oldChat.length - 1].id : 0;
            })
            .catch((error) => {
                console.error('Error getting chat:', error);
            });
    }

    // Initial chat update
    updateChat();

    // Set interval for periodic chat updates
    setInterval(updateChat, 1000);

    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }
});
