

function PawnList() {
   var self = this;
   this.list = [];
   this.findById = function(id) {
      var pawnIndex = -1;
      for(var i = 0; i < self.list.length; i++) {
         if(self.list[i].id == id) {
            pawnIndex = i;
            break;
         }
      }
      return pawnIndex;
   };
   
   this.add = function(id, sprite, x, y) {
      var pawnIndex = self.findById(id);
      var pawn;
      if(pawnIndex < 0) {
         pawn = { id: id, sprite: sprite };
         pawn.sprite.x = x;
         pawn.sprite.y = y;
         
         self.list.push(pawn);
      }
      else {
         pawn = self.list[pawnIndex];
         pawn.sprite.x = x;
         pawn.sprite.y = y;
      }
      return pawn;
   };
   
   this.removeByIndex = function(pawnIndex) {
      if(pawnIndex >= 0) {
         self.list.splice(pawnIndex, 1);
      }
   };
   
   
   return this;
}