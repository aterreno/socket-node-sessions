var socket = io.connect();

var logmsg = function(msg) { 
  document.getElementById('msgbox').innerHTML += msg;
};

 $(document).ready(function() {

  socket.on('connect', function(){
    logmsg('<b>Connect!</b>');
    socket.send('ping');
  });

  socket.on('progress', function (data) {
    console.log(data);
    $("#progress").text("Progress: " + data.percent + '%');    
  });

  socket.on('message', function(message){
    console.log(message);
    logmsg('Message: ' + message);
  }); 
  
  $('#sendmsg').click(function() { 
      console.log("sendmsg"); 
      socket.send('ping'); 
  });  
 });