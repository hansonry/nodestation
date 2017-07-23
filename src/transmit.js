
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
   }
};

