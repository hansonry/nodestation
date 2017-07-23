
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
            y:  pawn.y
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
   }
};

