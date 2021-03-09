var io = require('socket.io')();


/* socket io on connection event listener */
io.on("connection", function(socket){
    socket.on('add-message', function(data){
        io.emit("add-message", data)
    })
})

module.exports = io;