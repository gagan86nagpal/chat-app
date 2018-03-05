const path = require('path');
const publicPath = path.join(__dirname ,'../public');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
var port = process.env.PORT || 3000;


var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log('New Client connected');
    // Info to everyone except the user who  joined
    socket.broadcast.emit('newMessage',{
        from:"admin",
        text:"New User Joined",
        createdAt:new Date().getTime()
    })
    // Greeting to user just joined by socket.emit
    socket.emit('newMessage',{
        from:"admin",
        text:"Welcome",
        createdAt:new Date().getTime()
    })
    socket.on('disconnect',()=>{
        console.log('Client Disconnected');
    })
    // If a client sends a message , it is resent to everyone including sender
    socket.on('createMessage',(msg)=>{
        io.emit('newMessage',{
            from:msg.from,
            text:msg.text,
            createdAt:new Date().getTime()
        })
    })
});

server.listen(port,()=>{
console.log(`server is  up on ${port}`)
});