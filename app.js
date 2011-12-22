var express = require('express'),
    form = require('connect-form'),
    app = express.createServer(form({ keepExtensions: true })),    
    parseCookie = require('connect').utils.parseCookie,
    progressEvent = new require('./progressEvent').ProgressEvent(),    
    http = require('http');
 
app.configure(function () {
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
    console.log(percent);
  });
});