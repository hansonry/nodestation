/*
    Node Station - A Space Station 13 clone
    Copyright (C) 2017  Ryan Hanson

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var shortid = require('shortid');
var lists   = require('./src/lists');
var tx      = require('./src/transmit');

var clientList = lists.createClientList();
var pawnList   = lists.createPawnList();
var tileList   = lists.createTileList();
var itemList   = lists.createItemList();

{
   var w = 'wall';
   var f = 'floor';
   var tempMap = [
      w, w, w, w, w, w, w, w, w, w,
      w, f, f, f, f, f, f, f, f, w,
      w, f, f, f, f, f, f, f, f, w,
      w, f, f, f, f, f, f, f, f, w,
      w, f, f, f, f, f, f, f, f, w,
      w, f, f, f, f, f, f, f, f, w,
      w, f, f, f, f, f, f, f, f, w,
      w, f, f, f, f, f, f, f, f, w,
      w, f, f, f, f, f, f, f, f, w,
      w, w, w, w, w, w, w, w, w, w,
   ];
   tileList.setup(10, 10, tempMap);
}

itemList.add(shortid.generate(), 'idCard');


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

   for(var i = 0; i < itemList.list.length; i++) {      
      tx.item.add(client.socket, itemList.list[i]);
   }

   tx.tile.newMap(client.socket, tileList.width, tileList.height);


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
   for(var k = 0; k < clientList.list.length; k++) {
      var targetClient = clientList.list[k];
      for(var i = 0; i < pawnList.list.length; i++) {
         var pawn = pawnList.list[i];
         tx.pawn.update(targetClient.socket, pawn);
      }

      for(var i = 0; i < tileList.list.length; i++) {
         var tile = tileList.list[i];
         tx.tile.update(targetClient.socket, tile);
      }
      for(var i = 0; i < itemList.list.length; i++) {
         tx.item.update(targetClient.socket, itemList.list[i]);
      }
      //console.log('emit update');
   }
}, updateTimeSeconds * 1000); // milliseconds


