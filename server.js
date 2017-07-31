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

var updateTimeSeconds = 0.05;
var hostPort = 3000;

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

var itemCard = itemList.add(shortid.generate(), 'idCard');

itemCard.x = 5;
itemCard.y = 5;


app.use(express.static('webroot'));
app.get('/', function(req, res) {
   res.sendFile(__dirname + '/webroot/index.html');
});

function nextTo(x1, y1, x2, y2) {
   var dx = x2 - x1;
   var dy = y2 - y1;
   return dx >= -1 && dx <= 1 && dy >= -1 && dy <= 1;
}

io.on('connection', function(socket) {
   console.log('a user connected');
   var client = clientList.add(socket);
   client.controlledPawn = pawnList.add(shortid.generate());

   // Send Server Information


   socket.emit('serverInfo', {
      updateTimeSeconds: updateTimeSeconds
   });
   // Send current state of the game
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
   for(var i = 0; i < tileList.list.length; i++) {
      var tile = tileList.list[i];
      tx.tile.update(client.socket, tile);
   }


   tx.pawn.owned(socket, client.controlledPawn);

   socket.on('key', function(msg) {
      //console.log(msg);
      if(msg.event == 'down') {
         client.keys[msg.key] = true;
      }
      else if(msg.event == 'up') {
         client.keys[msg.key] = false;
      }
   });
   socket.on('grab', function (msg) {
      var pawn = client.controlledPawn;
      var itemIndex = itemList.findById(msg.itemId);
      //console.log(msg);
      if(itemIndex >= 0) {
         var item = itemList.list[itemIndex];
         if(nextTo(pawn.x, pawn.y, item.x, item.y) && item.inventoryId == '') {
            item.inventoryId = pawn.id;
            item.dirty = true;
         }
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
   socket.on('chat', function(msg) {
      //console.log("message: " + msg.message);
      for(var i = 0; i < clientList.list.length; i++) {
         tx.chat.send(clientList.list[i].socket, msg.message);
      }
   });
   
});



http.listen(hostPort, function() {
   console.log('listening on *:' + hostPort);
});



setInterval(function() {
   //console.log('Tick!');
   // Iterate though the pawns
   for(var i = 0; i < pawnList.list.length; i++) {
      var pawn = pawnList.list[i];


      if(pawn.motion.state == 'walking') {
         pawn.motion.ticksLeft --;
         if(pawn.motion.ticksLeft <= 0) {
            pawn.x = pawn.motion.target.x;
            pawn.y = pawn.motion.target.y;
            pawn.motion.state = 'standing';
         }
         
         pawn.dirty = true;
      }


   }

   // Update pawn motion
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

      var pawn = client.controlledPawn;


      var new_x = pawn.x + dx;
      var new_y = pawn.y + dy;

      if((dx != 0 || dy != 0) && 
         pawn.motion.state == 'standing' &&
         !tileList.isBlocking(new_x, new_y)) {

         pawn.motion.target.x = new_x;
         pawn.motion.target.y = new_y;
         pawn.motion.state = 'walking';
         pawn.motion.ticksLeft = pawn.motion.walkSpeedTicks;
         pawn.dirty = true;
         
      }

      //console.log("x: " + client.controlledPawn.x + ", y: " + client.controlledPawn.y);
   }


   // Send Pawn Updates if nessary
   for(var i = 0; i < pawnList.list.length; i++) {
      var pawn = pawnList.list[i];
      if(pawn.dirty) {
         for(var k = 0; k < clientList.list.length; k++) {
            var targetClient = clientList.list[k];
            tx.pawn.update(targetClient.socket, pawn);
         }
         pawn.dirty = false;
      }
   }

   // Send Item update if nessary
   for(var i = 0; i < itemList.list.length; i++) {
      var item = itemList.list[i];
      if(item.dirty) {
         for(var k = 0; k < clientList.list.length; k++) {
            var targetClient = clientList.list[k];
            tx.item.update(targetClient.socket, itemList.list[i]);
         }
         item.dirty = false;
      }
      //console.log('emit update');
   }
}, updateTimeSeconds * 1000); // milliseconds


