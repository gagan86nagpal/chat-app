var socket =io(); // it is in upper loaded library , it creates the connection as client
socket.on('connect',function(){
    console.log('Connected to Server');
});

socket.on('disconnect',function(){
    console.log('Disconnected from Server');
});

socket.on('newMessage',function(msg){
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    li.text(`${msg.from} ${formattedTime}: ${msg.text}`);
    $('#messages').append(li);
    console.log("Got new Message",msg);
});


socket.on('newLocationMessage',function(msg){
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var li = jQuery('<li> </li>');
    var a= jQuery('<a target="_blank">My Current Location</a>');
    li.text(`${msg.from} ${formattedTime}: `);
    a.attr('href',msg.url);
    li.append(a);
    $('#messages').append(li);
})

$('#message-form').on('submit',function(e){
    e.preventDefault();
    
    var messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage',{
        from:"user",
        text:messageTextbox.val()
    },function(){
        messageTextbox.val('');
    })
    
})

var locationButton = $('#location-button');
locationButton.on('click',function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported');
    }
    
    locationButton.attr('disabled','disabled').text('Sending location..');
    navigator.geolocation.getCurrentPosition(function(posiiton){
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage',{
            latitude:posiiton.coords.latitude,
            longitude:posiiton.coords.longitude
        })
    },function(){
        locationButton.removeAttr('disabled').text('Send location');
        return alert('Unable to fetch Location');
    })
})