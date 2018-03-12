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


socket.on('newLocationMessage',function(message){
    var li = jQuery('<li> </li>');
    var a= jQuery('<a target="_blank">My Current Location</a>');
    li.text(`${message.from}: `);
    a.attr('href',message.url);
    li.append(a);
    $('#messages').append(li);
})

$('#message-form').on('submit',function(e){
    e.preventDefault();
    socket.emit('createMessage',{
        from:"user",
        text:jQuery('[name=message]').val()
    },function(){
        
    })
    
})

var locationButton = $('#location-button');
locationButton.on('click',function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported');
    }
    navigator.geolocation.getCurrentPosition(function(posiiton){
        socket.emit('createLocationMessage',{
            latitude:posiiton.coords.latitude,
            longitude:posiiton.coords.longitude
        })
    },function(){
        return alert('Unable to fetch Location');
    })
})