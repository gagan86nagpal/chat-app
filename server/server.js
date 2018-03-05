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
    
    socket.emit('newMessage',{
        from:"gagannagpal68@example.com",
        text:"Hey",
        createdAt:"123"
    });
    
    
    socket.on('createMessage',(msg)=>{
        console.log('New Message At Server By CLient',msg);
    })
});

server.listen(port,()=>{
console.log(`server is  up on ${port}`)
});