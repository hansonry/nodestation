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
var tiledMapLoader = require('./src/tiledMapLoader');
var typeSetReq     = require('./src/typeSet');

var rawMap         = require('./map/stationMap');
var rawTypes       = require('./webroot/src/types');


var clientList = lists.createClientList();
var pawnList   = lists.createPawnList();
var tileList   = lists.createTileList();
var itemList   = lists.createItemList();
var doorList   = lists.createDoorList();
var typeSet    = typeSetReq.createTypeSet();

rawTypes.buildTypeSet(typeSet);
tiledMapLoader.load(rawMap, tileList, itemList, doorList, typeSet, shortid);


var updateTimeSeconds = 0.05;
var hostPort = 3000;



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
         if(nextTo(pawn.x, pawn.y, item.x, item.y) && item.inventory.id == '') {
            if(pawn.inventorySlots.handRight == '') {
               item.inventory.id = pawn.id;
               pawn.inventorySlots.handRight = item.id;
               item.dirty = true;
               pawn.dirty = true;
            }
            else if(pawn.inventorySlots.handLeft == '') {
               item.inventory.id = pawn.id;
               pawn.inventorySlots.handLeft = item.id;
               item.dirty = true;
               pawn.dirty = true;
            }
         }
      }
   });
   socket.on('drop', function (msg) {
      var pawn = client.controlledPawn;
      var itemIndex = itemList.findById(msg.itemId);
      if(itemIndex >= 0) {
         var item = itemList.list[itemIndex];
         if(item.inventory.id == pawn.id) {
            var inLeftHand  = pawn.inventorySlots.handLeft == item.id;
            var inRightHand = pawn.inventorySlots.handRight == item.id;
            if(inLeftHand || inRightHand) {
               item.inventory.id = '';
               item.x = pawn.x;
               item.y = pawn.y;
               item.dirty = true;
               if(inLeftHand) {
                  pawn.inventorySlots.handLeft = '';
               }
               else if(inRightHand) {
                  pawn.inventorySlots.handRight = '';
               }
               pawn.dirty = true;
            }

         }
      }

   });
   socket.on('internalMove', function(msg) {
      var pawn = client.controlledPawn;
      var itemIndex = itemList.findById(msg.itemId);
      if(itemIndex >= 0 && pawn.inventorySlots[msg.destSlot] == '') {
         var item = itemList.list[itemIndex];
         if(item.inventory.id == pawn.id) {
            var inLeftHand  = pawn.inventorySlots.handLeft == item.id;
            var inRightHand = pawn.inventorySlots.handRight == item.id;
            if(inLeftHand || inRightHand) {
               // The item is in our hands, we can move it
               if(inLeftHand) {
                  pawn.inventorySlots.handLeft = '';
               }
               else if(inRightHand) {
                  pawn.inventorySlots.handRight = '';
               }
               pawn.inventorySlots[msg.destSlot] = item.id;
               pawn.dirty = true;               
               

            }
            else if(msg.destSlot == 'handLeft' || msg.destSlot == 'handRight') {
               // We are going to move it to one of our hands
               var slot = pawn.findSlotByItemId(item.id);
               if(slot != '') {
                  pawn.inventorySlots[slot] = '';
                  pawn.inventorySlots[msg.destSlot] = item.id;
                  pawn.dirty = true;
               }

            }
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


      if(pawn.motion.state == 'walking' || pawn.motion.state == 'attacking') {
         pawn.motion.ticksLeft --;
         
         pawn.dirty = true;
      }
      if(pawn.motion.state == 'walking' && pawn.motion.ticksLeft <= 0) {
         pawn.x = pawn.motion.target.x;
         pawn.y = pawn.motion.target.y;
         pawn.motion.state = 'standing';
      }
      if(pawn.motion.state == 'attacking' && pawn.motion.ticksLeft <= 0) {
         var targetPawnIndex = pawnList.findById(pawn.motion.target.id);
         pawn.motion.state = 'standing';
         if(targetPawnIndex >= 0) {
            var targetPawn = pawnList.list[targetPawnIndex];
            targetPawn.health -= 10;
            if(targetPawn.health < 0) {
               targetPawn.health = 0;
            }
            targetPawn.dirty = true;
         }
      }


   }

   // Update pawn motion
   for(var i = 0; i < clientList.list.length; i++) {
      var client = clientList.list[i];
      var pawn = client.controlledPawn;
      var dx = 0;
      var dy = 0;
      var newFacing = pawn.facing;
      if(pawn.health > 0) {
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
         !doorList.isBlocking(new_x, new_y)) {

         var targetPawnIndex = pawnList.findInArea(new_x, new_y, 1, 1);


         if(targetPawnIndex < 0) {
            pawn.motion.target.x = new_x;
            pawn.motion.target.y = new_y;
            pawn.motion.state = 'walking';
            pawn.motion.ticksLeft = pawn.motion.walkSpeedTicks;
            pawn.dirty = true;
         }
         else {
            var targetPawn = pawnList.list[targetPawnIndex];
            if(targetPawn.health > 0) {
               if(pawn.intent == 'harm') {
                  pawn.motion.state = 'attacking';
                  pawn.motion.ticksLeft = pawn.motion.walkSpeedTicks;
                  pawn.motion.target.id = targetPawn.id;
                  pawn.motion.target.x = targetPawn.x;
                  pawn.motion.target.y = targetPawn.y;
                  pawn.dirty = true;
               }
               else if(pawn.intent == 'help' && targetPawn.intent == 'help') {
                  pawn.motion.target.x = new_x;
                  pawn.motion.target.y = new_y;
                  pawn.motion.state = 'walking';
                  pawn.motion.ticksLeft = pawn.motion.walkSpeedTicks;
                  pawn.dirty = true;

                  targetPawn.motion.target.x = pawn.x;
                  targetPawn.motion.target.y = pawn.y;
                  targetPawn.motion.state = 'walking';
                  targetPawn.motion.ticksLeft = targetPawn.motion.walkSpeedTicks;
                  targetPawn.dirty = true;
               }
            }
            else  {
               pawn.motion.target.x = new_x;
               pawn.motion.target.y = new_y;
               pawn.motion.state = 'walking';
               pawn.motion.ticksLeft = pawn.motion.walkSpeedTicks;
               pawn.dirty = true;
            }
         }
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
         var pawnIndex = pawnList.findById(door.triggeredById);
         if(pawnIndex >= 0) {
            var pawn = pawnList.list[pawnIndex];
            if(pawn.inventorySlots.card == '') {
               door.state = 'nope'; // This will haunt me later
               door.dirty = true;
               door.ticksLeft = door.openSpeedTicks;
            }
            else {
               door.state = 'opening';
               door.dirty = true;
               door.ticksLeft = door.openSpeedTicks;

            }
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


