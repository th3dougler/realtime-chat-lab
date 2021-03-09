var socket = io();	

// For todays date;
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

let handleInput = null;

socket.on('add-message', function(data){
    console.log(data);
    let chatBox = document.getElementById('chat-box');
    let newMessage = document.createElement('div');
    if(handleInput.value.toString() == data.handle){
        newMessage.className = "me";
        console.log("me")
    }else{
        newMessage.className = "not-me";
    }
    newMessage.innerHTML=`<strong>${data.handle}:</strong> ${data.message}<br/><span class="time">${data.time}</span>`;
    chatBox.appendChild(newMessage);
    
})

document.addEventListener("DOMContentLoaded",function(){
    let inputForm = document.getElementById("input-form");
    let messageInput = document.getElementById('message-input');
    handleInput = document.getElementById('handle-input');

    inputForm.addEventListener("submit", function(evt){
        evt.preventDefault();
        evt.stopPropagation();
        socket.emit('add-message',{
            handle: handleInput.value.toString(),
            message: messageInput.value.toString(),
            time: new Date().today() + " @ " + new Date().timeNow(),
        })
        return false;
    })
})

