
module.exports = {
   pawn: {
      add: function(socket, pawn) {
         socket.emit('addPawn', {
            id:     pawn.id,
            first_name: pawn.first_name,
            last_name: pawn.last_name,
            x:      pawn.x,
            y:      pawn.y,
            health: pawn.health,
            inventorySlots: {
               handLeft:  pawn.inventorySlots.handLeft,
               handRight: pawn.inventorySlots.handRight,
               card:      pawn.inventorySlots.card,
               uniform:   pawn.inventorySlots.uniform,
               suit:      pawn.inventorySlots.suit,
               head:      pawn.inventorySlots.head,
               eyes:      pawn.inventorySlots.eyes,
               mask:      pawn.inventorySlots.mask,
               ears:      pawn.inventorySlots.ears,
               feet:      pawn.inventorySlots.feet,
               hands:     pawn.inventorySlots.hands,
               neck:      pawn.inventorySlots.neck
            },
            facing: pawn.facing
         });
      },
      remove: function(socket, pawn) {
         socket.emit('removePawn', {
            id: pawn.id
         });
      },
      update: function(socket, pawn) {
         socket.emit('updatePawn', {
            id: pawn.id,
            x:  pawn.x,
            y:  pawn.y,
            facing: pawn.facing,
            motion: {
               state: pawn.motion.state,
               target: {
                  x: pawn.motion.target.x,
                  y: pawn.motion.target.y
               },
               ticksTotal: pawn.motion.ticksTotal,
               ticksLeft: pawn.motion.ticksLeft
            },
            drag: {
               type: pawn.drag.type,
               id:   pawn.drag.id
            },
            health: pawn.health,
            inventorySlots: {
               handLeft:  pawn.inventorySlots.handLeft,
               handRight: pawn.inventorySlots.handRight,
               card:      pawn.inventorySlots.card,
               uniform:   pawn.inventorySlots.uniform,
               suit:      pawn.inventorySlots.suit,
               head:      pawn.inventorySlots.head,
               eyes:      pawn.inventorySlots.eyes,
               mask:      pawn.inventorySlots.mask,
               ears:      pawn.inventorySlots.ears,
               feet:      pawn.inventorySlots.feet,
               hands:     pawn.inventorySlots.hands,
               neck:      pawn.inventorySlots.neck
            }
         });
      },
      owned: function(socket, pawn) {
         socket.emit('ownedPawn', {
            id: pawn.id,
            intent: pawn.intent
         });
      }
   },
   tile: {
      newMap: function(socket, width, height) {
         socket.emit('newMap', {
            width: width,
            height: height
         });
      },
      update: function(socket, tile) {
         var msg = {
            x: tile.x,
            y: tile.y,
            layers: {}
         }
         for(var key in tile.layers) {
            msg.layers[key] = tile.layers[key];
         }
         socket.emit('updateTile', msg);
      }
   },
   item: {
      add: function(socket, item) {
         socket.emit('addItem', {
            id: item.id,
            type: item.type,
            x: item.x,
            y: item.y,
            inventory: {
               id: item.inventory.id,
            }
         });
      },
      remove: function(socket, item) {
         socket.emit('removeItem', {
            id: item.id
         });
      },
      update: function(socket, item) {
         socket.emit('updateItem', {
            id: item.id,
            type: item.type,
            x: item.x,
            y: item.y,
            inventory: {
               id: item.inventory.id,
            }
         });
      }
   },
   door: {
      add: function(socket, door) {
         socket.emit('addDoor', {
            x: door.x,
            y: door.y,
            type: door.type,
            state: door.state
         });
      },
      remove: function(socket, door) {
         socket.emit('removeDoor', {
            x: door.x,
            y: door.y
         });
      },
      update: function(socket, door) {
         socket.emit('updateDoor', {
            x: door.x,
            y: door.y,
            type: door.type,
            state: door.state,
            ticksLeft: door.ticksLeft,
            ticksTotal: door.ticksTotal
         });
      }
   },

   chat: {
      send: function(socket, message, pawn) {
		 var newmessage = pawn.first_name + " " + pawn.last_name + " says, " + message;
         socket.emit('chat', {
            message: newmessage
         });
      }
   }
};
