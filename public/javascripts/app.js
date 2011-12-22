$(document).ready(function() {
  var pusher = new Pusher('7d718e13067550e5ad49');
  var channel = pusher.subscribe('sockets');
  channel.bind('message', function(data) {
    $("#progress").text("Progress:" + data + "%");
  });
});
