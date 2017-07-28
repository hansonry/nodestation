

function PawnList() {
   var self = this;
   this.list = [];
   this.reconnect = function() {
      this.list = [];
   }
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
   
   this.add = function(id, sprite) {
      var pawnIndex = self.findById(id);
      var pawn;
      if(pawnIndex < 0) {
         pawn = { id: id, sprite: sprite };
         self.list.push(pawn);
      }
      else {
         pawn = self.list[pawnIndex];
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

function ItemList() {
   var self = this;
   this.list = [];
   this.findById = function(id) {
      var itemIndex = -1;
      for(var i = 0; i < self.list.length; i++) {
         if(self.list[i].id == id) {
            itemIndex = i;
            break;
         }
      }
      return itemIndex;
   };
   
   this.add = function(id, sprite, type, x, y) {
      var itemIndex = self.findById(id);
      var item;
      if(itemIndex < 0) {
         item = { id: id, type: type, sprite: sprite };
         item.sprite.x = x;
         item.sprite.y = y;
         
         self.list.push(item);
      }
      else {
         item = self.list[itemIndex];
         item.sprite.x = x;
         item.sprite.y = y;
      }
      return item;
   };
   
   this.removeByIndex = function(itemIndex) {
      if(itemIndex) {
         self.list.splice(itemIndex, 1);
      }
   };
   
   
   return this;
}