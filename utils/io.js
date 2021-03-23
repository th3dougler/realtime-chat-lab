var io = require('socket.io')();
var userList = require('../data/userList');

/* socket io on connection event listener */
io.on("connection", function(socket){
    
    socket.on('add-message', function(data){
        io.emit("add-message", data)
    })
    
    socket.on('user-connect', function(data){
        io.emit('user-connect', data);
        userList[data.id] = data.handle;
        io.emit('set-users',userList);
    })
    
    socket.on('disconnect', function(data){
        delete userList[socket.id]
        io.emit('set-users',userList);  
    })

})

module.exports = io;