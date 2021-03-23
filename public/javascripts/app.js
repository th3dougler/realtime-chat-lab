var socket = io();

// For todays date;
Date.prototype.today = function () {
  return (
    (this.getDate() < 10 ? "0" : "") +
    this.getDate() +
    "/" +
    (this.getMonth() + 1 < 10 ? "0" : "") +
    (this.getMonth() + 1) +
    "/" +
    this.getFullYear()
  );
};

// For the time now
Date.prototype.timeNow = function () {
  return (
    (this.getHours() < 10 ? "0" : "") +
    this.getHours() +
    ":" +
    (this.getMinutes() < 10 ? "0" : "") +
    this.getMinutes() +
    ":" +
    (this.getSeconds() < 10 ? "0" : "") +
    this.getSeconds()
  );
};
let chatBox;
let scrolled = false;
let userHandle = "";
let userListContainer;

socket.on("add-message", function (data) {
  let newMessage = document.createElement("div");
  scrolled = false;
  if (data.id == socket.id) {
    newMessage.className = "me";
  } else {
    newMessage.className = "not-me";
  }
  newMessage.innerHTML = `<strong>${data.handle}:</strong> ${data.message}<br/><span class="time">${data.time}</span>`;
  chatBox.appendChild(newMessage);
  scrollBottom();
});

socket.on("user-connect", function (data) {
  if (data.id != socket.id) {
    scrolled = false;
    let newMessage = document.createElement("div");
    newMessage.className = "not-me";
    newMessage.innerHTML = `<strong>${data.handle} has joined the chat </strong><br/><span class="time">${data.time}</span>`;
    chatBox.appendChild(newMessage);
    scrollBottom();
  }
});
socket.on('set-users', function(userList){
    while(userListContainer.firstChild){
        userListContainer.removeChild(userListContainer.firstChild)
    }
    for (user of Object.values(userList)){
        let li = document.createElement('li');
        li.innerHTML = `<strong>${user}</strong>`
        userListContainer.appendChild(li);
    }
})


function scrollBottom() {
  if (!scrolled) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let inputForm = document.getElementById("input-form");
  let messageInput = document.getElementById("message-input");
  let handleDisplay = document.getElementById("handle-display");
  let handleDisplayContainer = document.getElementById(
    "handle-display-container"
  );

  let handleForm = document.getElementById("handle-form");
  chatBox = document.getElementById("chat-box");
  userListContainer = document.getElementById('user-list-container')
  //materializecss init
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems, { dismissible: false });
  //submit user message
  instances[0].open();

  inputForm.addEventListener("submit", function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    socket.emit("add-message", {
      id: socket.id,
      handle: userHandle,
      message: messageInput.value.toString(),
      time: new Date().today() + " @ " + new Date().timeNow(),
    });
    messageInput.value = "";
    return false;
  });
  //when user clicks on div with handle, open update modal
  handleDisplayContainer.addEventListener("click", function (evt) {
    new FormData(handleForm).get("handle-input").value = userHandle;
    instances[0].open();
  });

  //on click of update modal Update btn, update handle
  handleForm.addEventListener("submit", function (evt) {
    evt.preventDefault();
    let newHandle = String(new FormData(handleForm).get("handle-input"));
    socket.emit("user-connect", {
      id: socket.id,
      handle: newHandle,
      time: new Date().today() + " @ " + new Date().timeNow(),
    });

    userHandle = newHandle.match(/\w{1,12}/);
    handleDisplay.innerHTML = userHandle;
    instances[0].close();
  });

  chatBox.addEventListener("scroll", function (evt) {
    scrolled = true;
  });
});
