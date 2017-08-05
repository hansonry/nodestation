
function ClientList() {
   var self = this;
   this.list = [];
   this.add = function(socket) {
      var obj = { 
         socket: socket, 
         keys: {
            up: false,
            down: false,
            left: false,
            right: false
         },
         controlledPawn: undefined
      };
      self.list.push(obj);
      return obj;
   };
   this.remove = function(socket) {
      for(var i = 0; i < self.list.length; i ++)
      {
         if(self.list[i].socket == socket) {
            self.list.splice(i, 1);
            break;
         }
      }
   };
   return this;
}


function PawnList() {
   var self = this;
   this.list = [];
   this.init = {x: 1, y: 1}
   this.findInArea = function(x, y, width, height) {
      var pawnIndex = -1;
      for(var i = 0; i < self.list.length; i++) {
         var pawn = self.list[i];
         if(pawn.x >= x && pawn.y >= y &&
            pawn.x < x + width && pawn.y < y + height) {
               pawnIndex = i;
               break;
            }
      }
      return pawnIndex;
      
   };
   this.add = function(id) {
      var obj = {
         id: id,
         x: self.init.x, 
         y: self.init.y,
         motion: {
            state: 'standing',
            target: { x: self.init.x, y: self.init.y },
            walkSpeedTicks: 5,
            ticksLeft: 0
         },
         dirty: true
      };
      self.list.push(obj);
      return obj;
   };
   this.remove = function(pawn) {
      for(var i = 0; i < self.list.length; i ++)
      {
         if(self.list[i] == pawn) {
            self.list.splice(i, 1);
            break;
         }
      }
   };
   return this;
}

function ItemList() {
   var self = this;
   this.list = [];
   this.findByInventoryIdAndType = function(inventoryId, type) {
      var itemIndex = -1;
      for(var i = 0; i < self.list.length; i++) {
         var item = self.list[i];
         if(item.inventoryId == inventoryId && item.type == type) {
            itemIndex = i;
            break;
         }
      }
      return itemIndex;
   }
   this.add = function(id, type) {
      var obj = {
         id: id,
         type: type,
         x: 0, 
         y: 0,
         inventoryId: '',
         dirty: true
      };
      self.list.push(obj);
      return obj;
   };
   this.remove = function(item) {
      for(var i = 0; i < self.list.length; i ++)
      {
         if(self.list[i] == item) {
            self.list.splice(i, 1);
            break;
         }
      }
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
   return this;
}

function DoorList() {
   var self = this;
   this.list = [];
   
   this.findByCoord = function(x, y) {
      var doorIndex = -1;
      for(var i = 0; i < self.list.length; i++) {
         var door = self.list[i];
         if(door.x == x && door.y == y) {
            doorIndex = i;
            break;
         }
      }
      return doorIndex;
   };
   this.add = function(x, y, type) {
      var obj = {
         state: 'close',
         x: x, 
         y: y,
         type: type,
         dirty: true
      };
      self.list.push(obj);
      return obj;
   };
   this.remove = function(x, y) {
      var doorIndex = self.findByCoord(x, y);
      if(doorIndex >= 0) {
         self.list.splice(doorIndex, 1);
      }      
   };
   this.isBlocking = function(x, y) {
      var doorIndex = self.findByCoord(x, y);
      if(doorIndex < 0) {
         return false;
      }
      else {
         var door = self.list[doorIndex];
         if(door.state == 'open') {
            return false;
         }
         else {
            return true;
         }
      }
   }
   return this;
}


function TileList() {
   var self = this;
   this.list = [];
   this.version = 0;
   this.width = -1;
   this.height = -1;


   this.findByCoord = function(x, y) {
      var tileIndex = -1;
      for(var i = 0; i < self.list.length; i++) {
         var tile = self.list[i];
         if(tile.x == x && tile.y == y) {
            tileIndex = i;
            break;
         }
      }
      return tileIndex;
   }

   this.resize = function(width, height) {
      self.width = width;
      self.height = height;
      
   };

   this.setup = function(width, height, data) {
      self.resize(width, height);
      var i = 0;
      for(var y = 0; y < height; y++ ) {
         for(var x = 0; x < width; x++) {
            self.add(data[i], x, y, 'floor');
            i++;
         }
      }
   };


   this.set = function(x, y, layer, type, index) {
      var tileIndex = self.findByCoord(x, y);
      var obj;
      if(tileIndex < 0) {
         obj = {
            x: x, 
            y: y,
            layers: {}
         };

         self.list.push(obj);
      }
      else {
         obj = self.list[tileIndex];
      }

      obj.layers[layer] = {
         index: index,
         type: type,
      };
      return obj;
   };
   this.remove = function(tile) {
      for(var i = 0; i < self.list.length; i ++)
      {
         if(self.list[i] == tile) {
            self.list.splice(i, 1);
            break;
         }
      }
   };
   this.isBlocking = function(x, y) {
      var blocking = false;
      for(var i = 0; i < self.list.length; i ++) {
         var tile = self.list[i];
         if(tile.x == x && tile.y == y && tile.layers.wall != undefined) {            
            blocking = true;
            break;
         }
      }
      return blocking;
   }
   return this;
}

module.exports = {
   createClientList: function() {
      return new ClientList();
   },
   createPawnList: function() {
      return new PawnList();
   },
   createTileList: function() {
      return new TileList();
   },
   createItemList: function() {
      return new ItemList();
   },
   createDoorList: function() {
      return new DoorList();
   }
   
};


