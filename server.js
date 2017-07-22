var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('webroot'));
app.get('/', function(req, res) {
   res.sendFile(__dirname + '/webroot/index.html');
});


io.on('connection', function(socket) {
   console.log('a user connected');
});

io.on('disconnect', function() {
   console.log('a user disconnected');
});

http.listen(3000, function() {
   console.log('listening on *:3000');
});

