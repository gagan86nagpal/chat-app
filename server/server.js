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
    
    socket.on('disconnect',()=>{
        console.log('Client Disconnected');
    })
    
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