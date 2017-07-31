
module.exports = {
   pawn: {
      add: function(socket, pawn) {
         socket.emit('addPawn', {
            id: pawn.id,
            x:  pawn.x,
            y:  pawn.y
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
            id: pawn.id
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
         socket.emit('updateTile', {
            type: tile.type,
            x: tile.x,
            y: tile.y
         });
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
   chat: {
      send: function(socket, message) {
         socket.emit('chat', {
            message: message
         });
      }
   }
};

