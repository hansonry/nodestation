
function clientList() {
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


function pawnList() {
   var self = this;
   this.list = [];
   this.add = function(id) {
      var obj = {
         id: id,
         x: 0, 
         y: 0, 
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

function itemList() {
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

function tileList() {
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
   return this;
}

module.exports = {
   createClientList: function() {
      return new clientList();
   },
   createPawnList: function() {
      return new pawnList();
   },
   createTileList: function() {
      return new tileList();
   },
   createItemList: function() {
      return new itemList();
   }
};


