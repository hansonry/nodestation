

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
   
   this.findAllByCoord = function(x, y, list) {
      for(var i = 0; i < self.list.length; i++) {
         var pawn = self.list[i];
         if(pawn.x == x && pawn.y == y) {
            list.push(pawn);
         }
      }
   }
   
   this.add = function(id) {
      var pawnIndex = self.findById(id);
      var pawn;
      if(pawnIndex < 0) {
         pawn = { 
            id: id, 
            sprites: {
               body: {
                  head: undefined,
                  body: undefined,
                  leftArm: undefined,
                  rightArm: undefined,
                  leftLeg: undefined,
                  rigthLeg: undefined,
                  face: undefined,
                  eyes: undefined
               },
               clothes: {
                  head: undefined,
                  underwear: undefined,
                  feet: undefined,
                  hands: undefined,
                  neck: undefined,
                  uniform: undefined,
                  suit: undefined,
                  mask: undefined
               }
            },
            drag: {type: '', id: ''},
            inventorySlots: {
               handLeft:  '',
               handRight: '',
               card:      '',
               uniform:   '',
               suit:      '',
               head:      '',
               eyes:      '',
               mask:      '',
               ears:      '',
               feet:      '',
               hands:     '',
               neck:      ''
            },
            cellIndices: {
               body: {
                  head:     20,
                  body:     32,
                  leftArm:  4,
                  rightArm: 8,
                  leftLeg:  12,
                  rightLeg: 16,
                  face:     126,
                  eyes:     1
               },
               clothes: {
                  head: 208,
                  underwear: 68,
                  feet:  32,
                  hands: -1,
                  neck: -1,
                  uniform: 12,
                  suit: -1,
                  mask: -1,
                  eyes: -1,
                  ears: -1
               }
            },
            colors: {
               skin: 0xffe0bd,
               hair: 0xb55239,
               eyes: 0x542a0e
            },
            group: undefined,
            x: 0,
            y: 0,
            facing: 'south',
            motion: {
               state: 'standing',
               ticksLeft: 0,
               ticksLeft: 0,
               target: { x: 0, y: 0 }
            },
            lastUpdateWatch: 0,
            health: 100,
            dirty: true,
            updateCellIndices: function(offset) {
               function set(sprite, cellIndex, offset) {
                  if(cellIndex < 0) {
                     sprite.visible = false;
                  }
                  else {
                     sprite.frame = cellIndex + offset;
                     sprite.visible = true;
                  }
               }
               set(this.sprites.body.head,     this.cellIndices.body.head,     offset);
               set(this.sprites.body.body,     this.cellIndices.body.body,     offset);
               set(this.sprites.body.leftArm,  this.cellIndices.body.leftArm,  offset);
               set(this.sprites.body.rightArm, this.cellIndices.body.rightArm, offset);
               set(this.sprites.body.leftLeg,  this.cellIndices.body.leftLeg,  offset);
               set(this.sprites.body.rightLeg, this.cellIndices.body.rightLeg, offset);
               set(this.sprites.body.face,     this.cellIndices.body.face,     offset);
               set(this.sprites.body.eyes,     this.cellIndices.body.eyes,     offset);

               this.sprites.body.head.tint = this.colors.skin;
               this.sprites.body.body.tint = this.colors.skin;
               this.sprites.body.leftArm.tint = this.colors.skin;
               this.sprites.body.rightArm.tint = this.colors.skin;
               this.sprites.body.leftLeg.tint = this.colors.skin;
               this.sprites.body.rightLeg.tint = this.colors.skin;
               this.sprites.body.face.tint = this.colors.hair;
               this.sprites.body.eyes.tint = this.colors.eyes;

               set(this.sprites.clothes.head,      this.cellIndices.clothes.head,      offset);
               set(this.sprites.clothes.underwear, this.cellIndices.clothes.underwear, offset);
               set(this.sprites.clothes.feet,      this.cellIndices.clothes.feet,      offset);
               set(this.sprites.clothes.hands,     this.cellIndices.clothes.hands,     offset);
               set(this.sprites.clothes.neck,      this.cellIndices.clothes.neck,      offset);
               set(this.sprites.clothes.uniform,   this.cellIndices.clothes.uniform,   offset);
               set(this.sprites.clothes.suit,      this.cellIndices.clothes.suit,      offset);
               set(this.sprites.clothes.mask,      this.cellIndices.clothes.mask,      offset);
               set(this.sprites.clothes.eyes,      this.cellIndices.clothes.eyes,      offset);
               set(this.sprites.clothes.ears,      this.cellIndices.clothes.ears,      offset);

            }

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
         if(tempItem.x == x && tempItem.y == y && tempItem.inventory.id == '') {
            itemIndex = i;
            break;
         }
      }
      return itemIndex;
   };
   this.findAllByCoord = function(x, y, list) {
      for(var i = 0; i < self.list.length; i++) {
         var item = self.list[i];
         if(item.x == x && item.y == y && item.inventory.id == '') {
            list.push(item);
         }
      }
   }
   
   this.findByInventoryId = function(id) {
      var itemIndex = -1;
      for(var i = 0; i < self.list.length; i++) {
         if(self.list[i].inventory.id == id) {
            itemIndex = i;
            break;
         }
      }
      return itemIndex;
   };
   this.findAllByInventroyId = function(id, list) {
      for(var i = 0; i < self.list.length; i++) {
         var item = self.list[i];
         if(item.inventory.id == id) {
            list.push(item);
         }
      }
   };
   
   this.add = function(id,  x, y) {
      var itemIndex = self.findById(id);
      var item;
      if(itemIndex < 0) {
         item = { 
            id: id, 
            sprite: undefined, 
            group: undefined,
            x: x, 
            y: y, 
            inventory: {
               id: ''
            }
         };
         
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
   }
   
   this.add = function(x, y, state, type) {
      var door = {
         x: x,
         y: y,
         state: state,
         sprite: undefined,
         spriteCover: undefined,
         spriteLight: undefined,
         group: undefined,
         ticksLeft: 0,
         ticksTotal: 0,
         type: type,
         lastUpdateWatch: 0,
         dirty: true
      };
      self.list.push(door);
      return door;
   }
   
   this.removeByIndex = function(doorIndex) {
      if(doorIndex >= 0) {
         self.list.splice(doorIndex, 1);
      }
   }

}

function TileList() {
   var self = this;
   this.list   = [];
   this.width  = -1;
   this.height = -1;


   this.findByCoord = function(x, y, layer) {
      var tileIndex = -1;
      for(var i = 0; i < self.list.length; i++) {
         var tile = self.list[i];
         if(tile.x == x && tile.y == y) {
            tileIndex = -1;
            break;
         }
      }
      return tileIndex;
   };

   this.resize = function(width, height) {
      self.width = width;
      self.height = height;
   };
   this.clear = function() {
      self.list = [];
   };

   this.set = function(x, y, layer, type, index) {
      var tileIndex = self.findByCoord(x, y);
      var tile = self.setByIndex(tileIndex, x, y, layer, type, index);
      return tile;
   };
   this.setByIndex = function(tileIndex, x, y, layer, type, index) {
      var tile = undefined;
      if(tileIndex < 0) {
         tile = {
            x: x,
            y: y,
            layers: {}
         };
         self.list.push(tile);
      }
      else {
         tile = self.list[tileIndex];
      }

      tile.layers[layer] = {
         type: type,
         index: index
      };

      return tile;
   };
}

