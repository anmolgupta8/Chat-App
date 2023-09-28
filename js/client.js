const socket = io("http://localhost:8000", { transports: ["websocket"] });
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('./ting_sms.mp3');

const append = (message,position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position); // left or right
    messageContainer.append(messageElement); 
    if(position == 'left') audio.play();
};

window.setInterval(function() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }, 2000);

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You : ${message}`,'right');
    socket.emit('send',message);
    messageInput.value = '';
});

const name = prompt("Please enter your name to join the chat...");
socket.emit('new-user-joined',name);

socket.on('user-joined',name=>{
    append(`${name} joined the chat`,'left' );
});

socket.on('leave',name=>{
    append(`${name} left the chat`,'left');
});

socket.on('receive',data=>{
    append(`${data.name} : ${data.message}`,'left');
});