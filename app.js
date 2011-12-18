var io = require('socket.io'),
    express = require('express'),
    MemoryStore = express.session.MemoryStore,
    app = express.createServer(),
    sessionStore = new MemoryStore(),
    parseCookie = require('connect').utils.parseCookie,
    Session = require('connect').middleware.session.Session;
 
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
  res.render('index.jade', { title: 'SuperUploader', sessionID: req.sessionID });  
  console.log(req.sessionID);
});
 
sio.sockets.on('connection', function (socket) {
    var hs = socket.handshake;
    console.log('A socket with sessionID ' + hs.sessionID + ' connected!');
    
    var intervalID = setInterval(function () {
        hs.session.reload( function () { 
            hs.session.touch().save();
        });
    }, 60 * 1000);

    socket.on('ping', function () {
      console.log('ping');
    });

    socket.on('disconnect', function () {
        console.log('A socket with sessionID ' + hs.sessionID  + ' disconnected!');        
        clearInterval(intervalID);
    }); 
});