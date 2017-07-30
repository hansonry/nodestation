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
   floor:        2
};

var consts = {
   tile: {
     width:  32,
     height: 32
   } 
};

function applyCoordToSprite(sprite, coord) {
   sprite.x = coord.x * consts.tile.width;
   sprite.y = coord.y * consts.tile.height;
}

var socket = undefined;
NodeStation.Play.create = function () {

	Kiwi.State.prototype.create.call( this );
   var self = this;

   this.pawnList = new PawnList();
   this.itemList = new ItemList();

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


   this.map = new Kiwi.GameObjects.Tilemap.TileMap(this);

   this.map.setTo(consts.tile.width, consts.tile.height, 10, 10);
   
   this.map.createTileType(0);
   this.map.createTileType(1);
   this.map.createTileType(2);
   
   this.mapLayer = this.map.createNewLayer('map', this.textures.mapTiles);
   

   this.mapLayer.setTile(0, 0, 1);
   this.mapLayer.setTile(0, 1, 2);
   this.addChildAt( this.mapLayer, 0);
   this.mapLayer.x = 20;
   this.mapLayer.y = 20;
   this.mapLayer.visible = true;


	// Add the GameObjects to the stage
	this.addChild( this.heart );
	this.addChild( this.crown );
	//this.addChild( this.pawn );
	this.addChild( this.bomb );
	this.addChild( this.name );
   
   // Connect to socket.io
   socket = io();
   
   socket.on('reconnect', function() {      
      for(var i = 0; i < self.pawnList.list.length; i++) {
         var pawn = self.pawnList.list[i];
         self.removeChild(pawn.sprite);
         self.removeChild(pawn.spriteTop);
         self.removeChild(pawn.spriteBottom);
         self.removeChild(pawn.spriteFoot);
      }
      self.pawnList.reconnect();
   });
   
   
   socket.on('newMap', function(msg) {
      self.removeChild(self.mapLayer);
      self.mapLayer.destroy();
      self.map.setTo(consts.tile.width, consts.tile.height, msg.width, msg.height);
      self.mapLayer = self.map.createNewLayer('map', self.textures.mapTiles);
      self.addChildAt(self.mapLayer, 0);
   });
   socket.on('updateTile', function(msg) {
      var tileIndex;
      var mapTileImageLookup = mapTileImageMap[msg.type];
      if(msg.type == '') {
         tileIndex = 0;
      }
      else if(mapTileImageLookup) {
         tileIndex = mapTileImageLookup + 1;
      }
      else {
         tileIndex = 1; // questionMark
      }

      self.mapLayer.setTile(msg.x, msg.y, tileIndex);
   });
   socket.on('addPawn', function(msg) {
      var pawnIndex = self.pawnList.findById(msg.id);
      if(pawnIndex < 0) {
         sprite = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawn);         
         self.addChildAt(sprite, 2);
         spriteTop = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnClothes);
         spriteTop.cellIndex = 1;
         spriteBottom = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnClothes);
         spriteBottom.cellIndex = 2;
         spriteFoot = new Kiwi.GameObjects.Sprite(
            self, self.textures.pawnClothes);
         spriteFoot.cellIndex = 3;

         self.addChildAt(sprite, 2);
         self.addChildAt(spriteTop, 3);
         self.addChildAt(spriteBottom, 3);
         self.addChildAt(spriteFoot, 3);

         self.pawnList.add(msg.id, sprite, spriteTop, spriteBottom, spriteFoot);
         applyCoordToSprite(sprite, msg);
         applyCoordToSprite(spriteTop, msg);
         applyCoordToSprite(spriteBottom, msg);
         applyCoordToSprite(spriteFoot, msg);
      }
      else
      {
         var pawn = self.pawnList.list[pawnIndex];
         applyCoordToSprite(pawn.sprite, msg);
      }
   });
   socket.on('removePawn', function(msg) {
      var pawnIndex = self.pawnList.findById(msg.id);
      if(pawnIndex >= 0)
      {
         var pawn = self.pawnList.list[pawnIndex];
         self.removeChild(pawn.sprite);
         self.removeChild(pawn.spriteTop);
         self.removeChild(pawn.spriteBottom);
         self.removeChild(pawn.spriteFoot);
         self.pawnList.removeByIndex(pawnIndex);
      }
   });
   socket.on('updatePawn', function(msg) {
      var pawnIndex = self.pawnList.findById(msg.id);
      if(pawnIndex >= 0)
      {
         var pawn = self.pawnList.list[pawnIndex];
         applyCoordToSprite(pawn.sprite, msg);
         applyCoordToSprite(pawn.spriteTop, msg);
         applyCoordToSprite(pawn.spriteBottom, msg);
         applyCoordToSprite(pawn.spriteFoot, msg);
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
      self.addChildAt(sprite, 1);
      self.itemList.add(msg.id, sprite, msg.type, msg.x, msg.y);
      applyCoordToSprite(sprite, msg);
   });
   socket.on('removeItem', function(msg) {
      var itemIndex = self.itemList.findById(id);
      if(itemIndex >= 0)
      {
         var sprite = pawnList.list[itemIndex].sprite;
         state.removeChild(sprite);
         self.pawnList.remove(itemIndex);
      }
   });
   socket.on('updateItem', function(msg) {
      var itemIndex = self.itemList.findById(msg.id);
      if(itemIndex >= 0)
      {
         var item = self.itemList.list[itemIndex];
         applyCoordToSprite(item.sprite, msg);
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

NodeStation.Play.keyDownOnce = function(keyCode, key) {

   var textbox = document.getElementById("chatInputTextbox");
   if(textbox.value == "") {

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


NodeStation.Play.update = function() {

	Kiwi.State.prototype.update.call( this );
   
   /*
   for(var i = 0; i < this.list.length; i++) {
	   this.list[i].rotation += this.game.time.clock.rate * 0.01;
   }
   */
};

