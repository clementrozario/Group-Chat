// chat.js

let token;

window.addEventListener("DOMContentLoaded", () => {
    // Update the variable assignment here
    token = localStorage.getItem('token');
    
    if (token) {
        const decoded = parseJwt(token);
        document.getElementById('userName').textContent = decoded.name;
        
        // Fetch messages when the page is loaded
        fetchMessages();
        
        // Poll for new messages every 1 second
        setInterval(fetchMessages, 1000);
    } else {
        console.error("Token not found in localStorage");
    }
});

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');

// Load existing messages from local storage
const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
storedMessages.forEach((message) => {
    displayMessage(message.sender, message.text);
});

sendButton.addEventListener('click', () => {
    const userId = localStorage.getItem('userId');
    const message = messageInput.value;
    const obj = {
        message,
        userId
    };

    if (message) {
        axios.post("http://localhost:3000/chat/add-chat", obj)
            .then((response) => {
                const newMessage = { sender: 'You', text: response.data.message };
                displayMessage(newMessage.sender, newMessage.text);

                // Save the new message to local storage
                const updatedMessages = [...storedMessages, newMessage];
                localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
            })
            .catch((error) => {
                console.error("Error adding chat:", error);
            });

        messageInput.value = '';
    }
});

function fetchMessages() {
    axios.get("http://localhost:3000/chat/get-chat", {
        headers: { "Authorization": token }
    })
        .then((response) => {
            const allMessages = response.data.allMessage;

            allMessages.forEach((message) => {
                displayMessage('You', message.message);
            });
        })
        .catch((error) => {
            console.error("Error fetching chat:", error);
        });
}

function displayMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
