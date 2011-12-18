var socket = io.connect();

var logmsg = function(msg){ 
  document.getElementById('msgbox').innerHTML += msg;
};


socket.on('connect', function(){
  logmsg('<b>Connect!</b>');
  socket.send('ping');
});

socket.on('message', function(message){
    console.log(message);
  logmsg('Message: ' + JSON.stringify(message));
});    


 $(document).ready(function() {

    socket.on('message', function(message){
    console.log(message);
    logmsg('Message: ' + JSON.stringify(message));
    }); 
  
  $('#sendmsg').click(function() { 
      console.log("sendmsg"); 

      socket.emit('ping');



      socket.send('ping'); 
  });  
 });