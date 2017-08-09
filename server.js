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


var express        = require('express');
var app            = express();
var http           = require('http').Server(app);
var io             = require('socket.io')(http);
var shortid        = require('shortid');
var lists          = require('./src/lists');
var tx             = require('./src/transmit');
var rawMap         = require('./map/stationMap');
var tiledMapLoader = require('./src/tiledMapLoader');

var clientList = lists.createClientList();
var pawnList   = lists.createPawnList();
var tileList   = lists.createTileList();
var itemList   = lists.createItemList();
var doorList   = lists.createDoorList();

var updateTimeSeconds = 0.05;
var hostPort = 3000;

tiledMapLoader.load(rawMap, tileList, itemList, doorList, shortid);


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

   // Add all items for this client
   for(var i = 0; i < itemList.list.length; i++) {      
      tx.item.add(client.socket, itemList.list[i]);
   }

   // Push the current state of the map to the client
   tx.tile.newMap(client.socket, tileList.width, tileList.height);
   for(var i = 0; i < tileList.list.length; i++) {
      var tile = tileList.list[i];
      tx.tile.update(client.socket, tile);
   }
   
   // Add all the doors to the client
   for(var i = 0; i < doorList.list.length; i++) {
      var door = doorList.list[i];
      tx.door.add(client.socket, door);
   }


   //tx.pawn.owned(socket, client.controlledPawn);

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
   socket.on('drop', function (msg) {
      var pawn = client.controlledPawn;
      var itemIndex = itemList.findById(msg.itemId);
      if(itemIndex >= 0) {
         var item = itemList.list[itemIndex];
         if(item.inventoryId == pawn.id) {
            item.inventoryId = '';
            item.x = pawn.x;
            item.y = pawn.y;
            item.dirty = true;

         }
      }

   });
   socket.on('intent', function (msg) {
      // Dont really care about the message this time
      var pawn = client.controlledPawn;
      if(pawn.intent == 'help') {
         pawn.intent = 'harm';
         client.dirtyPawn = true;
      }
      else if(pawn.intent == 'harm') {
         pawn.intent = 'help';
         client.dirtyPawn = true;
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
      var pawn = client.controlledPawn;
      var dx = 0;
      var dy = 0;
      var newFacing = pawn.facing;
      if(client.keys.up) {
         dy = -1;
         newFacing = 'north';
      }
      else if(client.keys.down) {
         dy = 1;
         newFacing = 'south';
      }
      else if(client.keys.left) {
         newFacing = 'west';
         dx = -1;
      }
      else if(client.keys.right) {
         newFacing = 'east';
         dx = 1;
      }
      //console.log("dx: " + dx + ", dy: " + dy);



      var new_x = pawn.x + dx;
      var new_y = pawn.y + dy;
      
      
      if(dx != 0 || dy != 0) {
         var doorIndex = doorList.findByCoord(new_x, new_y);
         if(doorIndex >= 0) {
            var door = doorList.list[doorIndex];
            if(door.state == 'close') {
               door.triggered = true;
               door.triggeredById = pawn.id;
            }
         }
      }

      // Update Facing
      if(pawn.motion.state == 'standing' && pawn.facing != newFacing) {
         pawn.facing = newFacing;
         pawn.dirty = true;
      }
      

      // Update motion
      if((dx != 0 || dy != 0) && 
         pawn.motion.state == 'standing' &&
         !tileList.isBlocking(new_x, new_y) &&
         !doorList.isBlocking(new_x, new_y) &&
         !pawnList.isBlocking(new_x, new_y)) {

         pawn.motion.target.x = new_x;
         pawn.motion.target.y = new_y;
         pawn.motion.state = 'walking';
         pawn.motion.ticksLeft = pawn.motion.walkSpeedTicks;
         pawn.dirty = true;
         
      }

      //console.log("x: " + client.controlledPawn.x + ", y: " + client.controlledPawn.y);
   }
   
   // Update Doors
   for(var i = 0; i < doorList.list.length; i++) {
      var door = doorList.list[i];

      if(door.state == 'opening' || door.state == 'closing' || 
         door.state == 'nope') {
         door.ticksLeft --;
         door.dirty = true;
      }

      if(door.state == 'opening' && door.ticksLeft <= 0) {
         door.state = 'open';
      }
      else if(door.state == 'closing' && door.ticksLeft <= 0) {
         door.state = 'close';
      }
      else if(door.state == 'nope' && door.ticksLeft <= 0) {
         door.state = 'close';
      }

      if(door.state == 'open') {
         var pawnIndex = pawnList.findInArea(door.x - 1, door.y - 1, 3, 3);
         if(pawnIndex < 0) {
            door.state = 'closing';
            door.dirty = true;
            door.ticksLeft = door.openSpeedTicks;
         }
      }
      else if(door.state == 'close' && door.triggered) {
         // Open the door only if they have an ID card
         var itemIndex = itemList.findByInventoryIdAndType(door.triggeredById, 'idCard');
         if(itemIndex >= 0) {
         
            door.state = 'opening';
            door.dirty = true;
            door.ticksLeft = door.openSpeedTicks;
         }
         else {
            door.state = 'nope'; // This will haunt me later
            door.dirty = true;
            door.ticksLeft = door.openSpeedTicks;

         }

      }

      door.triggered = false;


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
            tx.item.update(targetClient.socket, item);
         }
         item.dirty = false;
      }
   }
   
   // Send Door updates if nessary
   for(var i = 0; i < doorList.list.length; i++) {
      var door = doorList.list[i];
      if(door.dirty) {
         for(var k = 0; k < clientList.list.length; k++) {
            var targetClient = clientList.list[k];
            tx.door.update(targetClient.socket, door);
         }
         door.dirty = false;
      }
   }

   // Update private Pawn information

   for(var i = 0; i < clientList.list.length; i++) {
      var targetClient = clientList.list[i];
      if(targetClient.dirtyPawn) {
         tx.pawn.owned(targetClient.socket, targetClient.controlledPawn);
         targetClient.dirtyPawn = false;
      }
   }
   
}, updateTimeSeconds * 1000); // milliseconds


