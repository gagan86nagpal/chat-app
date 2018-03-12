const path = require('path');
const publicPath = path.join(__dirname ,'../public');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const {generateMessage,generateLocationMessage} = require('./utils/message.js');
var port = process.env.PORT || 3000;


var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log('New Client connected');
    // Info to everyone except the user who  joined
    socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined'));
                          
    // Greeting to user just joined by socket.emit
    socket.emit('newMessage',generateMessage('Admin','Welcome to Chat App'));
    socket.on('disconnect',()=>{
        console.log('Client Disconnected');
    })
    // If a client sends a message , it is resent to everyone including sender
    socket.on('createMessage',(msg,callback)=>{
        io.emit('newMessage',generateMessage(msg.from,msg.text));
        callback('This is from Server'); 
    })
    
    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
    })
});

server.listen(port,()=>{
console.log(`server is  up on ${port}`)
});