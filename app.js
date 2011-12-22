var express = require('express'),
    form = require('connect-form'),
    app = express.createServer(form({ keepExtensions: true })),    
    parseCookie = require('connect').utils.parseCookie,
    progressEvent = new require('./progressEvent').ProgressEvent(),    
    http = require('http'),
    Pusher = require('node-pusher'),
    pusher = new Pusher({
      appId: '12424',
      key: '7d718e13067550e5ad49',
      secret: '5b03a57e8cef7810aff7'
    });
        
var socket_id = '1302.1081607';

app.configure(function () {
    pusher.auth(socket_id, 'sockets');
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
});
 
app.listen(3000);

app.get('/', function(req, res) {
  res.render('index.jade', { title: 'La la la' });
});

app.post('/upload', function(req, res, next){

  req.form.complete(function(err, fields, files){
    if (err) {
      console.log(err);
      next(err);
    } else {
      res.redirect('back');
    }
  });

  req.form.on('progress', function(bytesReceived, bytesExpected) {
    var percent = (bytesReceived / bytesExpected * 100) | 0;
    pusher.trigger('sockets', 'mesage', { from: 'Jaewoong', content: percent }, socket_id, function(err, req, res) {});    
  });
});