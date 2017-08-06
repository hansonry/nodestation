/*
    Node Station - A Space Station 13 clone
    Copyright (C) 2017  Ryan Hanson

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var NodeStation = NodeStation || {};

NodeStation.Play = new Kiwi.State( "Play" );

/**
* The PlayState in the core state that is used in the game. 
*
* It is the state where majority of the functionality occurs 'in-game' occurs.
*/


/**
* This create method is executed when a Kiwi state has finished loading
* any resources that were required to load.
*/

var itemImageMap = {
   questionMark: 0,
   idCard:       1  
};

var mapTileImageMap = {
   questionMark: 0,
   wall:         1,
};

var consts = {
   tile: {
     width:  32,
     height: 32
   },
   door: {
      animationLength: 6
   }
};

function applyCoordToSprite(sprite, coord, offsetX, offsetY) {
   
   offsetX = offsetX || 0;
   offsetY = offsetY || 0;
   sprite.x = coord.x * consts.tile.width + offsetX;
   sprite.y = coord.y * consts.tile.height + offsetY;
}

function createTileTypes(tileMap, length) {
   // This function was written by probing the createTileType return
   // May not be compatable in the future
   var firstIndex = -1;
   for(var i = 0; i < length; i++) {
      var tileType = tileMap.createTileType(i);
      if(i == 0) {
         firstIndex = tileType.index;
      }
   }
   return firstIndex;
}

var socket = undefined;
NodeStation.Play.create = function () {

	Kiwi.State.prototype.create.call( this );
   var self = this;

   this.pawnList = new PawnList();
   this.itemList = new ItemList();
   this.tileList = new TileList();
   this.doorList = new DoorList();


   this.updateTimeSeconds = 0.05;
   this.networkClock = this.game.time.addClock("network");

   this.ownedPawnId = '';
   
   // Creating groups
   this.pawnGroup = new Kiwi.Group(this);
   this.doorGroup = new Kiwi.Group(this);
   this.itemGroup = new Kiwi.Group(this);
   this.uiGroup = new Kiwi.Group(this);
   this.worldGroup = new Kiwi.Group(this);
   
   
   this.addChildAt(this.worldGroup, 0);
   this.addChildAt(this.uiGroup, 1);
   
   this.worldGroup.addChildAt(this.itemGroup, 10); 
   this.worldGroup.addChildAt(this.doorGroup, 11);
   this.worldGroup.addChildAt(this.pawnGroup, 12); 

	/*
	* Replace with your own game creation code here...
	*/

   
	this.name = new Kiwi.GameObjects.StaticImage(
		this, this.textures.kiwiName, 10, 10) ;

	this.heart = new Kiwi.GameObjects.Sprite(
		this, this.textures.icons, 10, 10 );
	this.heart.cellIndex = 8;
	this.heart.y = this.game.stage.height - this.heart.height - 10;




	this.crown = new Kiwi.GameObjects.Sprite(
		this, this.textures.icons, 10, 10 );
	this.crown.cellIndex = 10;
	this.crown.x = this.game.stage.width - this.crown.width - 10;
	this.crown.y = this.game.stage.height - this.crown.height - 10;


	this.bomb = new Kiwi.GameObjects.Sprite(
		this, this.textures.icons, 0, 10 );
	this.bomb.x = this.game.stage.width - this.bomb.width  -10;


	// Add the GameObjects to the stage
	this.uiGroup.addChild( this.heart );
	this.uiGroup.addChild( this.crown );
	this.uiGroup.addChild( this.bomb );
	this.uiGroup.addChild( this.name );
   

   this.map = new Kiwi.GameObjects.Tilemap.TileMap(this);

   this.map.setTo(consts.tile.width, consts.tile.height, 10, 10);


   this.tileIndices = {
      floor: createTileTypes(this.map, this.textures.mapFloor.cells.length),
      wall:  createTileTypes(this.map, this.textures.mapTiles.cells.length)
   };
   
   this.tileMapLayers = {
      floor: this.map.createNewLayer('floor', this.textures.mapFloor),
      wall:  this.map.createNewLayer('wall',  this.textures.mapTiles)
   };
   

   this.worldGroup.addChildAt( this.tileMapLayers.floor, 0);
   this.worldGroup.addChildAt( this.tileMapLayers.wall,  1);


   
   // Connect to socket.io
   socket = io();
   socket.on('serverInfo', function(msg) {
      self.updateTimeSeconds = msg.updateTimeSeconds;
   });
   socket.on('reconnect', function() {      
      for(var i = 0; i < self.pawnList.list.length; i++) {
         var pawn = self.pawnList.list[i];
         self.pawnGroup.removeChild(pawn.group);
      }
      self.pawnList.reconnect();

      for(var i = 0; i < self.itemList.list.length; i++) {
         var item = self.itemList.list[i];
         self.itemGroup.removeChild(item.sprite);
      }
      
      for(var i = 0; i < self.doorList.list.length; i++) {
         var door = self.doorList.list[i];
         self.doorGroup.removeChild(door.group);
      }
      self.doorList.list = [];

      self.itemList.reconnect();
      self.tileList.clear();
   });
   
   
   socket.on('newMap', function(msg) {
      self.worldGroup.removeChild(self.tileMapLayers.floor);
      self.worldGroup.removeChild(self.tileMapLayers.wall);
      self.tileMapLayers.floor.destroy();
      self.tileMapLayers.wall.destroy();

      self.map.setTo(consts.tile.width, consts.tile.height, msg.width, msg.height);
      self.tileMapLayers = {
         floor: self.map.createNewLayer('floor', self.textures.mapFloor),
         wall:  self.map.createNewLayer('wall',  self.textures.mapTiles)
      };
      

      self.worldGroup.addChildAt( self.tileMapLayers.floor, 0);
      self.worldGroup.addChildAt( self.tileMapLayers.wall,  1);
      self.tileList.resize(msg.width, msg.height);
   });
   socket.on('updateTile', function(msg) {

      for(var key in msg.layers) {
         // I might be too dumb to read this code
         self.tileList.set(msg.x, msg.y, key, 
                           msg.layers[key].type, msg.layers[key].index);
         self.tileMapLayers[key].setTile(msg.x, msg.y, 
                              self.tileIndices[key] + msg.layers[key].index);

      }


   });
   socket.on('addPawn', function(msg) {
      var pawnIndex = self.pawnList.findById(msg.id);
      if(pawnIndex < 0) {
         var pawn = self.pawnList.add(msg.id);
         
         pawn.sprites.body.head = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnBodyParts);
         pawn.sprites.body.body = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnBodyParts);
         pawn.sprites.body.leftArm = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnBodyParts);
         pawn.sprites.body.rightArm = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnBodyParts);
         pawn.sprites.body.leftLeg = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnBodyParts);
         pawn.sprites.body.rightLeg = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnBodyParts);
         pawn.sprites.body.face = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnFace);

         pawn.sprites.clothes.head = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnHead);
         pawn.sprites.clothes.underwear = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnUnderwear);
         pawn.sprites.clothes.feet = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnFeet);
         pawn.sprites.clothes.hands = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnHands);
         pawn.sprites.clothes.neck = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnNeck);
         pawn.sprites.clothes.uniform = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnUniform);
         pawn.sprites.clothes.suit = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnSuit);
         pawn.sprites.clothes.mask = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnMask);




         pawn.group = new Kiwi.Group(self);
         // totaly guessing on order
         pawn.group.addChildAt(pawn.sprites.body.head, 0);
         pawn.group.addChildAt(pawn.sprites.body.body, 1);
         pawn.group.addChildAt(pawn.sprites.body.leftArm, 2);
         pawn.group.addChildAt(pawn.sprites.body.rightArm, 3);
         pawn.group.addChildAt(pawn.sprites.body.leftLeg, 4);
         pawn.group.addChildAt(pawn.sprites.body.rightLeg, 5);


         pawn.group.addChildAt(pawn.sprites.clothes.underwear, 6);

         pawn.group.addChildAt(pawn.sprites.clothes.feet, 7);
         pawn.group.addChildAt(pawn.sprites.clothes.hands, 8);
         pawn.group.addChildAt(pawn.sprites.clothes.uniform, 9);


         pawn.group.addChildAt(pawn.sprites.clothes.mask, 10);
         pawn.group.addChildAt(pawn.sprites.clothes.neck, 11);

         pawn.group.addChildAt(pawn.sprites.body.face, 12);

         pawn.group.addChildAt(pawn.sprites.clothes.head, 13);
         pawn.group.addChildAt(pawn.sprites.clothes.suit, 14); 

         self.pawnGroup.addChild(pawn.group);

         
         pawn.x = msg.x;
         pawn.y = msg.y;
         pawn.facing = msg.facing;
         applyCoordToSprite(pawn.group, pawn);
         pawn.dirty = true;

      }
      else
      {
         var pawn = self.pawnList.list[pawnIndex];
         applyCoordToSprite(pawn.group, pawn);
         pawn.dirty = true;
      }
   });
   socket.on('removePawn', function(msg) {
      var pawnIndex = self.pawnList.findById(msg.id);
      if(pawnIndex >= 0)
      {
         var pawn = self.pawnList.list[pawnIndex];
         self.pawnGroup.removeChild(pawn.group);
         self.pawnList.removeByIndex(pawnIndex);
      }
   });
   socket.on('ownedPawn', function(msg) {
      console.log(msg);
      self.ownedPawnId = msg.id;
   });
   socket.on('updatePawn', function(msg) {
      var pawnIndex = self.pawnList.findById(msg.id);
      if(pawnIndex >= 0)
      {
         var pawn = self.pawnList.list[pawnIndex];

         pawn.motion.state          = msg.motion.state;
         pawn.motion.ticksLeft      = msg.motion.ticksLeft;
         pawn.motion.walkSpeedTicks = msg.motion.walkSpeedTicks;
         pawn.motion.target.x       = msg.motion.target.x;
         pawn.motion.target.y       = msg.motion.target.y;
         pawn.lastUpdateWatch       = 0;
         pawn.x                     = msg.x;
         pawn.y                     = msg.y;
         pawn.facing                = msg.facing;
         pawn.dirty = true;


         
      }
   });
   socket.on('addItem', function(msg) {
      sprite = new Kiwi.GameObjects.Sprite(
         self, self.textures.items);
      var cellIndex = itemImageMap[msg.type];
      if(cellIndex != undefined) {
         sprite.cellIndex = cellIndex;
      }
      else {
         sprite.cellIndex = 0;
      }
      self.itemGroup.addChild(sprite);
      var item = self.itemList.add(msg.id, sprite, msg.type, msg.x, msg.y);
      applyCoordToSprite(sprite, item);

      item.inventoryId = msg.inventoryId;
      if(item.inventoryId == '') {
         item.sprite.visible = true;
      }
      else {
         item.sprite.visible = false;
      }
   });
   socket.on('removeItem', function(msg) {
      var itemIndex = self.itemList.findById(id);
      if(itemIndex >= 0)
      {
         var sprite = pawnList.list[itemIndex].sprite;
         self.itemGroup.removeChild(sprite);
         self.pawnList.remove(itemIndex);
      }
   });
   socket.on('updateItem', function(msg) {
      var itemIndex = self.itemList.findById(msg.id);
      if(itemIndex >= 0)
      {
         var item = self.itemList.list[itemIndex];
         item.inventoryId = msg.inventoryId;
         item.x = msg.x;
         item.y = msg.y;
                  
         applyCoordToSprite(item.sprite, item);
         if(item.inventoryId == '') {
            item.sprite.visible = true;
         }
         else {
            item.sprite.visible = false;
         }
      }
   });
   socket.on('addDoor', function(msg) {
      var door = self.doorList.add(msg.x, msg.y, msg.state, msg.type);
      var doorType = doorTypeTable[msg.type];

      door.group = new Kiwi.Group(self);
      door.sprite = new Kiwi.GameObjects.Sprite(
         self, self.textures[doorType.spriteSheet]);

      door.spriteCover = new Kiwi.GameObjects.Sprite(
         self, self.textures[doorType.spriteSheet]);
      door.spriteLight = new Kiwi.GameObjects.Sprite(
         self, self.textures.doorOverlays);
      door.spriteLight.visible = false;

      door.group.addChildAt(door.sprite, 0);
      door.group.addChildAt(door.spriteCover, 1);
      door.group.addChildAt(door.spriteLight, 2);

      if(doorType.windowed) {
         door.spriteCover.visible = false;
      }
      
         
      applyCoordToSprite(door.group, door);
      if(door.state == 'open') {
         door.sprite.cellIndex = 1;
         door.spriteCover.cellIndex = 16;
         
      }
      else {
         door.sprite.cellIndex = 0;
         door.spriteCover.cellIndex = 15;
      }
      self.doorGroup.addChild(door.group); 

   });
   socket.on('removeDoor', function(msg) {
      var doorIndex = self.doorList.findByCoord(msg.x, msg.y);
      if(doorIndex >= 0)
      {
         var door = doorList.list[doorIndex];
         state.removeChild(door.sprite);
         self.doorList.removeByIndex(doorIndex);
      }
   });
   socket.on('updateDoor', function(msg) {
      var doorIndex = self.doorList.findByCoord(msg.x, msg.y);
      if(doorIndex >= 0)
      {
         var door = self.doorList.list[doorIndex];         
         door.x = msg.x;
         door.y = msg.y;
         door.state = msg.state;
         door.ticksLeft = msg.ticksLeft;
         door.openSpeedTicks = msg.openSpeedTicks;
         door.dirty = true;
         door.lastUpdateWatch = 0;
      }
   });

   socket.on('chat', function(msg) {
      var rootNode = document.createElement("DIV");
      var chatMessageNode = document.createTextNode(msg.message);
      rootNode.appendChild(chatMessageNode);
      var chatHistoryNode = document.getElementById("chatHistory");
      chatHistoryNode.appendChild(rootNode);
      
      
      // Scroll to the bottom
      chatHistoryNode.scrollTop = chatHistoryNode.scrollHeight;
   });


   // Input
   this.game.input.keyboard.onKeyDownOnce.add(this.keyDownOnce, this);
   this.game.input.keyboard.onKeyUp.add(this.keyUp, this);
};


NodeStation.Play.grab = function() {
   var ownedPawnIndex = this.pawnList.findById(this.ownedPawnId);
   if(ownedPawnIndex >= 0) {
      var ownedPawn = this.pawnList.list[ownedPawnIndex];
      // find the item we are over
      var itemIndex = this.itemList.findByCoord(ownedPawn.x, ownedPawn.y);
      if(itemIndex >= 0) {
         var item = this.itemList.list[itemIndex];
         if(item.inventoryId == '') {
            socket.emit('grab', {
               itemId: item.id
            });
         }
      }
   }
}

NodeStation.Play.drop = function() {
   var ownedPawnIndex = this.pawnList.findById(this.ownedPawnId);
   if(ownedPawnIndex >= 0) {
      var ownedPawn = this.pawnList.list[ownedPawnIndex];
      // find the item we are over
      var itemIndex = this.itemList.findByInventoryId(ownedPawn.id);
      if(itemIndex >= 0) {
         var item = this.itemList.list[itemIndex];
         if(item.inventoryId == ownedPawn.id) {
            socket.emit('drop', {
               itemId: item.id
            });
         }
      }
   }
}

NodeStation.Play.keyDownOnce = function(keyCode, key) {

   var textbox = document.getElementById("chatInputTextbox");
   if(textbox.value == "") {

      var key = undefined;
      if(keyCode == Kiwi.Input.Keycodes.UP) {
         key = 'up';
         textbox.blur();
      }
      else if(keyCode == Kiwi.Input.Keycodes.DOWN) {
         key = 'down';
         textbox.blur();
      }
      else if(keyCode == Kiwi.Input.Keycodes.LEFT) {
         key = 'left';
         textbox.blur();
      }
      else if(keyCode == Kiwi.Input.Keycodes.RIGHT) {
         key = 'right';
         textbox.blur();
      }
      else if(keyCode == Kiwi.Input.Keycodes.G) {
         NodeStation.Play.grab();
      }
      else if(keyCode == Kiwi.Input.Keycodes.D) {
         NodeStation.Play.drop();
      }

      if(key) {
         socket.emit('key', { event: 'down', key: key });
      }
   }
};

NodeStation.Play.keyUp = function(keyCode, key) {
   var key = undefined;
   if(keyCode == Kiwi.Input.Keycodes.UP) {
      key = 'up';
   }
   else if(keyCode == Kiwi.Input.Keycodes.DOWN) {
      key = 'down';
   }
   else if(keyCode == Kiwi.Input.Keycodes.LEFT) {
      key = 'left';
   }
   else if(keyCode == Kiwi.Input.Keycodes.RIGHT) {
      key = 'right';
   }

   if(key) {
      socket.emit('key', { event: 'up', key: key });
   }
};

function chatOnSubmit() {
   var textbox = document.getElementById("chatInputTextbox");
   if(socket) {
      socket.emit('chat', {message: textbox.value});
   }
   textbox.value = "";
   return false;
}

function getActionPercent(ticksLeft, totalTicks, lastUpdateWatch, updateTimeSeconds) {
   var totalTime = totalTicks * updateTimeSeconds;
   var timeLeft  = (ticksLeft * updateTimeSeconds) - lastUpdateWatch;

   if(timeLeft < 0) {
      timeLeft = 0
   }
   else if(timeLeft > totalTime) { 
      timeLeft = totalTime;
   }

   var percent = 1 - (timeLeft / totalTime);

   return percent;

}

NodeStation.Play.update = function() {

	Kiwi.State.prototype.update.call( this );
   
   // Moving the sprites between updates
   for(var i = 0; i < this.pawnList.list.length; i++) {
      var pawn = this.pawnList.list[i];

      var facingOffset;
      if(pawn.facing == 'south') {
         facingOffset = 0;
      }
      else if(pawn.facing == 'north') {
         facingOffset = 1;
      }
      else if(pawn.facing == 'east') {
         facingOffset = 2;
      }
      else if(pawn.facing == 'west') {
         facingOffset = 3;
      }
      else {
         facingOffset = 0;
      }

      pawn.lastUpdateWatch += this.networkClock.delta;
      if(pawn.motion.state == 'walking') {

         var percent = getActionPercent(pawn.motion.ticksLeft, 
                                        pawn.motion.walkSpeedTicks, 
                                        pawn.lastUpdateWatch, 
                                        this.updateTimeSeconds);


         var dx = pawn.motion.target.x - pawn.x;
         var dy = pawn.motion.target.y - pawn.y;

         var offsetX = consts.tile.width  * percent * dx;
         var offsetY = consts.tile.height * percent * dy;

         applyCoordToSprite(pawn.group, pawn, offsetX, offsetY);
         pawn.updateCellIndices(facingOffset);
         pawn.dirty = false;

      }

      if(pawn.dirty) {
         applyCoordToSprite(pawn.group, pawn);


         pawn.updateCellIndices(facingOffset);
         pawn.dirty = false;
      }
      if(pawn.id == this.ownedPawnId) {
         // Setup the Camera

         var camera = this.game.cameras.defaultCamera;
         this.worldGroup.x = -pawn.group.x + (camera.width  - consts.tile.width)  / 2;
         this.worldGroup.y = -pawn.group.y + (camera.height - consts.tile.height) / 2;
      }

   }
   
   // Updating Doors
   for(var i = 0; i < this.doorList.list.length; i++) {
      var door = this.doorList.list[i];
      door.lastUpdateWatch += this.networkClock.delta;
      if(door.dirty) {
         
         applyCoordToSprite(door.group, door);
         if(door.state == 'open') {
            door.sprite.cellIndex = 1;
            door.spriteCover.cellIndex = 16;
            door.spriteLight.visible = false;
            
         }
         else if(door.state == 'close') {
            door.sprite.cellIndex = 0;
            door.spriteCover.cellIndex = 15;
            door.spriteLight.visible = false;
         }
         else {
            var percent = getActionPercent(door.ticksLeft, 
                                           door.openSpeedTicks, 
                                           door.lastUpdateWatch, 
                                           this.updateTimeSeconds);
            door.spriteLight.visible = true;
            
            var offset = Math.floor(percent * consts.door.animationLength);
            if(door.state == 'opening') {

               door.sprite.cellIndex = 2 + offset;
               door.spriteCover.cellIndex = 17 + offset;
               door.spriteLight.cellIndex = offset;
            }
            else if(door.state == 'closing') {
               door.sprite.cellIndex = 2 + offset + consts.door.animationLength;
               door.spriteCover.cellIndex = 17 + offset + consts.door.animationLength;
               door.spriteLight.cellIndex = offset + consts.door.animationLength;
            }
            else if(door.state == 'nope') {
               door.sprite.cellIndex = 0;
               door.spriteCover.cellIndex = 15;
               door.spriteLight.cellIndex = offset + (consts.door.animationLength * 2);
            }
         }
      }
   }
};

