window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token')
    const decoded = parseJwt(token);
    document.getElementById('userName').textContent = decoded.name;
})

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

sendButton.addEventListener('click', () => {
    const userId = localStorage.getItem('userId')
    const message = messageInput.value;
    const obj = {
        message,
        userId
    }
    if (message) {
        axios.post("http://localhost:3000/chat/add-chat", obj)
        .then((response)=>{
            displayMessage('You', response.data.message);
        })
        messageInput.value = '';
    }
});


function displayMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}