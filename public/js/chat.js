var socket =io(); // it is in upper loaded library , it creates the connection as client



function scrollToBottom(){
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');
    
    
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
//    console.log('clientHeight:',clientHeight);
//    console.log('scrollTop:',scrollTop);
//    console.log('scrollHeight:',scrollHeight);
//    console.log('newMessageHeight:',newMessageHeight);
//    console.log('lastMessageHeight:',lastMessageHeight);
    //if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight){
    if(scrollTop<=scrollHeight){
        messages.scrollTop(scrollHeight);
    }
    
}

socket.on('connect',function(){
    console.log('Connected to Server');
    var params = jQuery.deparam(window.location.search);
    socket.emit('join',params,function(err){
        if(err){
            alert(err);
            window.location.href='/';
        }else{
            console.log('No Error');
        }
    });
});

/*




*/

socket.on('disconnect',function(){
    console.log('Disconnected from Server');
});

socket.on('updateUserList',function(users){
    var ol = jQuery('<ol> </ol>');
    users.forEach(function(user){
        ol.append(jQuery('<li> </li>').text(user));
    } )
    $('#users').html(ol);
});

socket.on('newMessage',function(msg){
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template,{
        text:msg.text,
        from:msg.from,
        createdAt:formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
});


socket.on('newLocationMessage',function(msg){
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template,{
        url:msg.url,
        from:msg.from,
        createdAt:formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
//    var li = jQuery('<li> </li>');
//    var a= jQuery('<a target="_blank">My Current Location</a>');
//    li.text(`${msg.from} ${formattedTime}: `);
//    a.attr('href',msg.url);
//    li.append(a);
//    $('#messages').append(li);
})

$('#message-form').on('submit',function(e){
    e.preventDefault();
    
    var messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage',{
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