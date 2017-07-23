var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var shortid = require('shortid');


var clientList = require('./src/clientList').create();
var pawnList   = require('./src/pawnList').create();
var tx         = require('./src/transmit');


app.use(express.static('webroot'));
app.get('/', function(req, res) {
   res.sendFile(__dirname + '/webroot/index.html');
});


io.on('connection', function(socket) {
   console.log('a user connected');
   var client = clientList.add(socket);
   client.controlledPawn = pawnList.add(shortid.generate());

   for(var i = 0; i < clientList.list.length; i++) {
      tx.pawn.add(clientList.list[i].socket, client.controlledPawn);
      if(clientList.list[i] != client) {
         tx.pawn.add(client.socket, clientList.list[i].controlledPawn);
      }
   }


   socket.on('key', function(msg) {
      //console.log(msg);
      if(msg.event == 'down') {
         client.keys[msg.key] = true;
      }
      else if(msg.event == 'up') {
         client.keys[msg.key] = false;
      }
   });
   socket.on('disconnect', function() {
      for(var i = 0; i < clientList.list.length; i++) {
         tx.pawn.remove(clientList.list[i].socket, client.controlledPawn);
      }
      pawnList.remove(client.controlledPawn);
      clientList.remove(socket);
      console.log('a user disconnected');
   });
});



http.listen(3000, function() {
   console.log('listening on *:3000');
});


var updateTimeSeconds = 0.05;
var speed = 100;
setInterval(function() {
   //console.log('Tick!');
   // Game update
   for(var i = 0; i < clientList.list.length; i++) {
      var client = clientList.list[i];
      var dx = 0;
      var dy = 0;
      if(client.keys.up) {
         dy = -1;
      }
      else if(client.keys.down) {
         dy = 1;
      }
      if(client.keys.left) {
         dx = -1;
      }
      else if(client.keys.right) {
         dx = 1;
      }
      //console.log("dx: " + dx + ", dy: " + dy);

      client.controlledPawn.x += (dx * updateTimeSeconds * speed);
      client.controlledPawn.y += (dy * updateTimeSeconds * speed);
   }

   // Send Events to all clients
   for(var i = 0; i < pawnList.list.length; i++) {
      var pawn = pawnList.list[i];

      for(var k = 0; k < clientList.list.length; k++) {
         var targetClient = clientList.list[k];
         tx.pawn.update(targetClient.socket, pawn);
      }
      //console.log('emit update');
   }
}, updateTimeSeconds * 1000); // milliseconds


