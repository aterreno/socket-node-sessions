$(document).ready(function() {
  // Enable pusher logging - don't include this in production
  Pusher.log = function(message) {
    if (window.console && window.console.log) window.console.log(message);
  };

  // Flash fallback logging - don't include this in production
  WEB_SOCKET_DEBUG = true;

  var pusher = new Pusher('7d718e13067550e5ad49');
  var channel = pusher.subscribe('sockets');
  channel.bind('message', function(data) {
    alert(data);
  }); 
});

