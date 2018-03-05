var socket =io(); // it is in upper loaded library , it creates the connection as client
socket.on('connect',function(){
    console.log('Connected to Server');
});

socket.on('disconnect',function(){
    console.log('Disconnected from Server');
});

socket.on('newMessage',function(msg){
    console.log("Got new Message",msg);
});

