

function PawnList() {
   var self = this;
   this.list = [];
   this.reconnect = function() {
      this.list = [];
   };
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
   
   this.add = function(id, sprite, spriteTop, spriteBottom, spriteFoot) {
      var pawnIndex = self.findById(id);
      var pawn;
      if(pawnIndex < 0) {
         pawn = { 
            id: id, 
            sprite: sprite,
            spriteTop: spriteTop,
            spriteBottom: spriteBottom,
            spriteFoot: spriteFoot,
            x: 0,
            y: 0,
            motion: {
               state: 'standing',
               ticksLeft: 0,
               walkSpeedTicks: 5,
               target: { x: 0, y: 0 }
            },
            lastUpdateWatch: 0
         };
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
   this.reconnect = function() {
      this.list = [];
   };
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
   this.findByCoord = function(x, y) {
      var itemIndex = -1;
      for(var i = 0; i < self.list.length; i++) {
         var tempItem = self.list[i];
         if(tempItem.x == x && tempItem.y == y) {
            itemIndex = i;
            break;
         }
      }
      return itemIndex;
   }
   
   this.add = function(id, sprite, type, x, y) {
      var itemIndex = self.findById(id);
      var item;
      if(itemIndex < 0) {
         item = { id: id, type: type, sprite: sprite, x: x, y: y, inventoryId: '' };
         
         self.list.push(item);
      }
      else {
         item = self.list[itemIndex];
         item.x = x;
         item.y = y;
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
