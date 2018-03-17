const path = require('path');
const publicPath = path.join(__dirname ,'../public');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const {Users} = require('./utils/users.js');
const {isRealString}  =require('./utils/validation.js');
const {generateMessage,generateLocationMessage} = require('./utils/message.js');
var port = process.env.PORT || 3000;


var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log('New Client connected');
    // Info to everyone except the user who  joined
  
                          
    socket.on('join',(params,callback)=>{
        if( !isRealString(params.name) || !isRealString(params.room) ){
            return callback('Name and Room Name are required');
        }
        
        
        // socket.leave('The Office Fans');
        // io.emit -> io.to('The Office Fans').emit
        // socket.broacast.emit -> socket.broadcast.to('The Office Fans').emit
        // socket.emit
        // Greeting to user just joined by socket.emit
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);
        io.to(params.room).emit('updateUserList',users.getUserList(params.room));
        socket.emit('newMessage',generateMessage('Admin','Welcome to Chat App'));
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} Joined`));
        callback();
    });
    socket.on('disconnect',()=>{
        var user  = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',` ${user.name} has left.`));
        }
    })
    // If a client sends a message , it is resent to everyone including sender
    socket.on('createMessage',(msg,callback)=>{
        var user = users.getUser(socket.id);
        if(user&& isRealString(msg.text) ) {
            io.to(user.room).emit('newMessage',generateMessage(user.name,msg.text));
        }
        callback(); 
    })
    
    socket.on('createLocationMessage',(coords)=>{
        var user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude));
        }
        
    })
});

server.listen(port,()=>{
console.log(`server is  up on ${port}`)
});