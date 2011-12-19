var io = require('socket.io'),
    express = require('express'),
    MemoryStore = express.session.MemoryStore,
    form = require('connect-form'),
    app = express.createServer(form({ keepExtensions: true })),   
    sessionStore = new MemoryStore(),
    parseCookie = require('connect').utils.parseCookie,
    Session = require('connect').middleware.session.Session,
    progressEvent = new require('./progressEvent').ProgressEvent();
 
app.configure(function () {
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
    app.use(express.session({store: sessionStore
        , secret: 'secret'
        , key: 'express.sid'}));
});
 
app.listen(3000);
var sio = io.listen(app);

sio.set('authorization', function (data, accept) {
    if (data.headers.cookie) {
        data.cookie = parseCookie(data.headers.cookie);
        data.sessionID = data.cookie['express.sid'];

        data.sessionStore = sessionStore;
        sessionStore.get(data.sessionID, function (err, session) {
            if (err || !session) {
                accept('Error', false);
            } else {

                data.session = new Session(data, session);
                accept(null, true);
            }
        });
    } else {
       return accept('No cookie transmitted.', false);
    }
}); 

app.get('/', function(req, res){
  res.render('index.jade', { title: 'Socket.IO, Express & Sessions', sessionID: req.sessionID });  
  console.log(req.sessionID);
});

app.get('/test', function(req, res){  
  console.log(req.sessionID);
  sio.sockets.in(req.sessionID).send('message', 'test');
  res.render('index.jade', { title: 'Socket.IO, Express & Sessions', sessionID: req.sessionID });  
  sio.sockets.in(req.sessionID).send('message', 'test');
});

app.post('/upload', function(req, res, next){

  console.log(req.sessionID);

  sio.sockets.in(req.sessionID).send('message','post');

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
    progressEvent.download(percent);    
  });
});
 
sio.sockets.on('connection', function (socket) {
    var hs = socket.handshake;
    console.log('A socket with sessionID ' + hs.sessionID + ' connected!');
    socket.join(hs.sessionID);
    
    var intervalID = setInterval(function () {
        hs.session.reload( function () { 
            hs.session.touch().save();
        });
    }, 60 * 1000);

    progressEvent.on('progress', function(percent) {
      sio.sockets.in(hs.sessionID).send('progress', percent);
      console.log(percent);
    });

    socket.on('ping', function () {
      console.log('ping');    
      sio.sockets.in(hs.sessionID).send('message','Man, good to see you back!');
    });

    socket.on('disconnect', function () {
        console.log('A socket with sessionID ' + hs.sessionID  + ' disconnected!');        
        clearInterval(intervalID);
    }); 
});