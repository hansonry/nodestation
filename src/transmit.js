
module.exports = {
   pawn: {
      add: function(socket, pawn) {
         socket.emit('addPawn', {
            id:     pawn.id,
            x:      pawn.x,
            y:      pawn.y,
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
               walkSpeedTicks: pawn.motion.walkSpeedTicks,
               ticksLeft: pawn.motion.ticksLeft
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
            inventoryId: item.inventoryId
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
            inventoryId: item.inventoryId
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
            openSpeedTicks: door.openSpeedTicks
         });
      }
   },

   chat: {
      send: function(socket, message) {
         socket.emit('chat', {
            message: message
         });
      }
   }
};

