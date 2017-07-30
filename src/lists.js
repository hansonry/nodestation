
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
   this.add = function(id, type) {
      var obj = {
         id: id,
         type: type,
         x: 0, 
         y: 0,
         inventoryId: '' 
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
   return this;
}

function TileList() {
   var self = this;
   this.list = [];
   this.version = 0;
   this.width = -1;
   this.height = -1;

   this.setup = function(width, height, data) {
      self.width = width;
      self.height = height;
      var i = 0;
      for(var y = 0; y < height; y++ ) {
         for(var x = 0; x < width; x++) {
            self.add(data[i], x, y);
            i++;
         }
      }
   };


   this.add = function(type, x, y) {
      var obj = {
         type: type,
         x: x, 
         y: y, 
      };
      self.list.push(obj);
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
         if(tile.x == x && tile.y == y && tile.type == 'wall') {
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
   }
};


