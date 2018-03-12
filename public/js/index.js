var socket =io(); // it is in upper loaded library , it creates the connection as client
socket.on('connect',function(){
    console.log('Connected to Server');
});

socket.on('disconnect',function(){
    console.log('Disconnected from Server');
});

socket.on('newMessage',function(msg){
    var li = jQuery('<li></li>');
    li.text(`${msg.from}: ${msg.text}`);
    $('#messages').append(li);
    console.log("Got new Message",msg);
});


$('#message-form').on('submit',function(e){
    e.preventDefault();
    socket.emit('createMessage',{
        from:"user",
        text:jQuery('[name=message]').val()
    },function(){
        
    })
    
})