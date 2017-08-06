


var game = new Phaser.Game(800, 600, Phaser.AUTO, 'engineContent',
                           {preload: preload, create: create, update: update},
                           false, false);


var gameScale = 1;
function preload() {

   game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
   game.scale.pageAlignHorizontally = true;
   game.scale.pageAlignVertically = true;

	game.load.spritesheet( "items", "assets/img/items.png", 32, 32 );
	game.load.image( "mapTiles", "assets/img/mapTiles.png", 32, 32 );
   game.load.image( "mapFloor", "assets/img/floors.png", 32, 32);


   // Doors
   game.load.spritesheet( "doorOverlays",            "assets/img/doors/overlays.png", 32, 32);
   game.load.spritesheet( "doorAtmos",               "assets/img/doors/atmos.png", 32, 32);
   game.load.spritesheet( "doorBananium",            "assets/img/doors/bananium.png", 32, 32);
   game.load.spritesheet( "doorCommand",             "assets/img/doors/command.png", 32, 32);
   game.load.spritesheet( "doorDiamond",             "assets/img/doors/diamond.png", 32, 32);
   game.load.spritesheet( "doorEngineering",         "assets/img/doors/engineering.png", 32, 32);
   game.load.spritesheet( "doorFreezer",             "assets/img/doors/freezer.png", 32, 32);
   game.load.spritesheet( "doorGold",                "assets/img/doors/gold.png", 32, 32);
   game.load.spritesheet( "doorMaintenance",         "assets/img/doors/maintenance.png", 32, 32);
   game.load.spritesheet( "doorMaintenanceExternal", "assets/img/doors/maintenanceexternal.png", 32, 32);
   game.load.spritesheet( "doorMedical",             "assets/img/doors/medical.png", 32, 32);
   game.load.spritesheet( "doorMining",              "assets/img/doors/mining.png", 32, 32);
   game.load.spritesheet( "doorPlasma",              "assets/img/doors/plasma.png", 32, 32);
   game.load.spritesheet( "doorPublic",              "assets/img/doors/public.png", 32, 32);
   game.load.spritesheet( "doorResearch",            "assets/img/doors/research.png", 32, 32);
   game.load.spritesheet( "doorStandstone",          "assets/img/doors/sandstone.png", 32, 32);
   game.load.spritesheet( "doorScience",             "assets/img/doors/science.png", 32, 32);
   game.load.spritesheet( "doorSecurity",            "assets/img/doors/security.png", 32, 32);
   game.load.spritesheet( "doorSilver",              "assets/img/doors/silver.png", 32, 32);
   game.load.spritesheet( "doorUranium",             "assets/img/doors/uranium.png", 32, 32);
   game.load.spritesheet( "doorVirology",            "assets/img/doors/virology.png", 32, 32);
   game.load.spritesheet( "doorWood",                "assets/img/doors/wood.png", 32, 32);

   // Pawn
   game.load.spritesheet( "pawnBodyParts", "assets/img/pawn/human_parts_greyscale.png", 32, 32);
   game.load.spritesheet( "pawnFeet",      "assets/img/pawn/feet.png", 32, 32);
   game.load.spritesheet( "pawnHands",     "assets/img/pawn/hands.png", 32, 32);
   game.load.spritesheet( "pawnHead",      "assets/img/pawn/head.png", 32, 32);
   game.load.spritesheet( "pawnFace",      "assets/img/pawn/human_face.png", 32, 32);
   game.load.spritesheet( "pawnMask",      "assets/img/pawn/mask.png", 32, 32);
   game.load.spritesheet( "pawnNeck",      "assets/img/pawn/neck.png", 32, 32);
   game.load.spritesheet( "pawnSuit",      "assets/img/pawn/suit.png", 32, 32);
   game.load.spritesheet( "pawnUnderwear", "assets/img/pawn/underwear.png", 32, 32);
   game.load.spritesheet( "pawnUniform",   "assets/img/pawn/uniform.png", 32, 32);
}

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
   sprite.x = Math.floor(coord.x * consts.tile.width  + offsetX);
   sprite.y = Math.floor(coord.y * consts.tile.height + offsetY);
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
var pawnList, itemList, tileList, doorList;
var updateTimeSeconds = 0.05;
var ownedPawnId = '';

var groups = {};

function create() {

   game.world.setBounds(-2000, -2000, 4000, 4000);
   pawnList = new PawnList();
   itemList = new ItemList();
   tileList = new TileList();
   doorList = new DoorList();

   groups.ui = game.add.group();
   groups.world = game.add.group();


   groups.map  = game.add.group(groups.world);
   groups.door = game.add.group(groups.world);
   groups.item = game.add.group(groups.world);
   groups.pawn = game.add.group(groups.world);

   
   groups.pawn.scale.set(gameScale);
   groups.door.scale.set(gameScale);
   groups.item.scale.set(gameScale);


   var map = game.add.tilemap();
   var mapTilesets = {};
   mapTilesets.floor =  map.addTilesetImage('mapFloor', undefined, 32, 32, 0, 0, 0);
   mapTilesets.wall  =  map.addTilesetImage('mapTiles', undefined, 32, 32, 0, 0, mapTilesets.floor.firstgid + mapTilesets.floor.total);


  var mapLayers = {};
  mapLayers.floor = map.create('floor', 10, 10, 32, 32, groups.map); 
  mapLayers.wall = map.createBlankLayer('wall', 10, 10, 32, 32, groups.map); 


   // Connect to socket.io
   socket = io();
   socket.on('serverInfo', function(msg) {
      updateTimeSeconds = msg.updateTimeSeconds;
   });
   socket.on('reconnect', function() {
      groups.pawn.removeAll(true);
      pawnList.reconnect();


      groups.item.removeAll(true);
      itemList.reconnect();

      groups.door.removeAll(true);
      
      doorList.list = [];


      tileList.clear();
   });

   socket.on('newMap', function(msg) {
      

      mapLayers.floor = map.create('floor',         msg.width, msg.height, 32, 32, groups.map); 
      mapLayers.wall = map.createBlankLayer('wall', msg.width, msg.height, 32, 32, groups.map);
      
      // If you dont scale these expicitly they will cause map sections to dissapear
      mapLayers.floor.scale.set(gameScale); 
      mapLayers.wall.scale.set(gameScale);

      //mapLayers.floor.resizeWorld();

      tileList.resize(msg.width, msg.height);
   });
   socket.on('updateTile', function(msg) {

      for(var key in msg.layers) {
         // I might be too dumb to read this code
         tileList.set(msg.x, msg.y, key, 
                      msg.layers[key].type, msg.layers[key].index);

         map.putTile(mapTilesets[key].firstgid + msg.layers[key].index,
                     msg.x, msg.y, mapLayers[key]);

      }
   });

   socket.on('addPawn', function(msg) {
      var pawnIndex = self.pawnList.findById(msg.id);
      if(pawnIndex < 0) {
         var pawn = self.pawnList.add(msg.id);
         
         pawn.sprites.body.head = game.add.sprite(0, 0, 'pawnBodyParts');
         //pawn.sprites.body.head.smoothed = false;
         pawn.sprites.body.body = game.add.sprite(0, 0, 'pawnBodyParts');
         //pawn.sprites.body.body.smoothed = false;
         pawn.sprites.body.leftArm = game.add.sprite(0, 0, 'pawnBodyParts');
         //pawn.sprites.body.leftArm.smoothed = false;
         pawn.sprites.body.rightArm = game.add.sprite(0, 0, 'pawnBodyParts');
         //pawn.sprites.body.rightArm.smoothed = false;
         pawn.sprites.body.leftLeg = game.add.sprite(0, 0, 'pawnBodyParts');
         //pawn.sprites.body.leftLeg.smoothed = false;
         pawn.sprites.body.rightLeg = game.add.sprite(0, 0, 'pawnBodyParts');
         //pawn.sprites.body.rightLeg.smoothed = false;
         pawn.sprites.body.face = game.add.sprite(0, 0, 'pawnFace');
         //pawn.sprites.body.face.smoothed = false;
         pawn.sprites.body.eyes = game.add.sprite(0, 0, 'pawnFace');

         pawn.sprites.clothes.head = game.add.sprite(0, 0, 'pawnHead');
         //pawn.sprites.clothes.head.smoothed = false;
         pawn.sprites.clothes.underwear = game.add.sprite(0, 0, 'pawnUnderwear');
         //pawn.sprites.clothes.underwear.smoothed = false;
         pawn.sprites.clothes.feet = game.add.sprite(0, 0, 'pawnFeet');
         //pawn.sprites.clothes.feet.smoothed = false;
         pawn.sprites.clothes.hands = game.add.sprite(0, 0, 'pawnHands');
         //pawn.sprites.clothes.hands.smoothed = false;
         pawn.sprites.clothes.neck = game.add.sprite(0, 0, 'pawnNeck');
         //pawn.sprites.clothes.neck.smoothed = false;
         pawn.sprites.clothes.uniform = game.add.sprite(0, 0, 'pawnUniform');
         //pawn.sprites.clothes.uniform.smoothed = false;
         pawn.sprites.clothes.suit = game.add.sprite(0, 0, 'pawnSuit');
         //pawn.sprites.clothes.suit.smoothed = false;
         pawn.sprites.clothes.mask = game.add.sprite(0, 0, 'pawnMask');
         //pawn.sprites.clothes.mask.smoothed = false;




         pawn.group = game.add.group(groups.pawn);
         // totaly guessing on order
         pawn.group.addAt(pawn.sprites.body.head, 0);
         pawn.group.addAt(pawn.sprites.body.eyes, 1);
         pawn.group.addAt(pawn.sprites.body.body, 2);
         pawn.group.addAt(pawn.sprites.body.leftArm, 3);
         pawn.group.addAt(pawn.sprites.body.rightArm, 4);
         pawn.group.addAt(pawn.sprites.body.leftLeg, 5);
         pawn.group.addAt(pawn.sprites.body.rightLeg, 6);


         pawn.group.addAt(pawn.sprites.clothes.underwear, 7);

         pawn.group.addAt(pawn.sprites.clothes.feet, 8);
         pawn.group.addAt(pawn.sprites.clothes.hands, 9);
         pawn.group.addAt(pawn.sprites.clothes.uniform, 10);


         pawn.group.addAt(pawn.sprites.clothes.mask, 11);
         pawn.group.addAt(pawn.sprites.clothes.neck, 12);

         pawn.group.addAt(pawn.sprites.body.face, 13);

         pawn.group.addAt(pawn.sprites.clothes.head, 14);
         pawn.group.addAt(pawn.sprites.clothes.suit, 15); 


         
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
         groups.pawn.remove(pawn.group, true);
         self.pawnList.removeByIndex(pawnIndex);
      }
   });
   socket.on('ownedPawn', function(msg) {
      console.log(msg);
      ownedPawnId = msg.id;
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
      sprite = game.add.sprite(0, 0, 'items');
      var cellIndex = itemImageMap[msg.type];
      if(cellIndex != undefined) {
         sprite.frame = cellIndex;
      }
      else {
         sprite.frame = 0;
      }
      groups.item.add(sprite);
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
         groups.item.remove(sprite, true);
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

      door.group = game.add.group(groups.door);
      door.sprite = game.add.sprite(0, 0, doorType.spriteSheet);
      door.spriteCover = game.add.sprite(0, 0, doorType.spriteSheet);
      door.spriteLight = game.add.sprite(0, 0, 'doorOverlays');

      door.spriteLight.visible = false;

      door.group.addAt(door.sprite, 0);
      door.group.addAt(door.spriteCover, 1);
      door.group.addAt(door.spriteLight, 2);

      if(doorType.windowed) {
         door.spriteCover.visible = false;
      }
      
         
      applyCoordToSprite(door.group, door);
      if(door.state == 'open') {
         door.sprite.frame = 1;
         door.spriteCover.frame = 16;
         
      }
      else {
         door.sprite.frame = 0;
         door.spriteCover.frame = 15;
      }

   });
   socket.on('removeDoor', function(msg) {
      var doorIndex = self.doorList.findByCoord(msg.x, msg.y);
      if(doorIndex >= 0)
      {
         var door = doorList.list[doorIndex];
         groups.door.remove(door.group);
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
   game.input.keyboard.onDownCallback = function() {
      var e = game.input.keyboard.event;
      var textbox = document.getElementById("chatInputTextbox");
      if(textbox.value == "") {

         var key = undefined;
         if(e.keyCode == Phaser.KeyCode.UP) {
            key = 'up';
            textbox.blur();
         }
         else if(e.keyCode == Phaser.KeyCode.DOWN) {
            key = 'down';
            textbox.blur();
         }
         else if(e.keyCode == Phaser.KeyCode.LEFT) {
            key = 'left';
            textbox.blur();
         }
         else if(e.keyCode == Phaser.KeyCode.RIGHT) {
            key = 'right';
            textbox.blur();
         }
         else if(e.keyCode == Phaser.KeyCode.G) {
            pawnGrab();
         }
         else if(e.keyCode == Phaser.KeyCode.D) {
            pawnDrop();
         }

         if(key) {
            socket.emit('key', { event: 'down', key: key });
         }
      }
   };
   game.input.keyboard.onUpCallback = function() {
      var e = game.input.keyboard.event;
      var key = undefined;
      if(e.keyCode == Phaser.KeyCode.UP) {
         key = 'up';
      }
      else if(e.keyCode == Phaser.KeyCode.DOWN) {
         key = 'down';
      }
      else if(e.keyCode == Phaser.KeyCode.LEFT) {
         key = 'left';
      }
      else if(e.keyCode == Phaser.KeyCode.RIGHT) {
         key = 'right';
      }

      if(key) {
         socket.emit('key', { event: 'up', key: key });
      }
   };

}

function pawnGrab() {
   var ownedPawnIndex = pawnList.findById(ownedPawnId);
   if(ownedPawnIndex >= 0) {
      var ownedPawn = pawnList.list[ownedPawnIndex];
      // find the item we are over
      var itemIndex = itemList.findByCoord(ownedPawn.x, ownedPawn.y);
      if(itemIndex >= 0) {
         var item = itemList.list[itemIndex];
         if(item.inventoryId == '') {
            socket.emit('grab', {
               itemId: item.id
            });
         }
      }
   }
}

function pawnDrop() {
   var ownedPawnIndex = pawnList.findById(ownedPawnId);
   if(ownedPawnIndex >= 0) {
      var ownedPawn = pawnList.list[ownedPawnIndex];
      // find the item we are over
      var itemIndex = itemList.findByInventoryId(ownedPawn.id);
      if(itemIndex >= 0) {
         var item = itemList.list[itemIndex];
         if(item.inventoryId == ownedPawn.id) {
            socket.emit('drop', {
               itemId: item.id
            });
         }
      }
   }
}


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

function update() {

   // Moving the sprites between updates
   for(var i = 0; i < pawnList.list.length; i++) {
      var pawn = pawnList.list[i];

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

      pawn.lastUpdateWatch += game.time.physicsElapsed;
      if(pawn.motion.state == 'walking') {

         var percent = getActionPercent(pawn.motion.ticksLeft, 
                                        pawn.motion.walkSpeedTicks, 
                                        pawn.lastUpdateWatch, 
                                        updateTimeSeconds);


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
      if(pawn.id == ownedPawnId) {
         // Setup the Camera
         //game.camera.x = pawn.group.x;// + (game.camera.width  - consts.tile.width)  / 2;
         //game.camera.y = pawn.group.y; // + (game.camera.height - consts.tile.height) / 2;
         game.camera.follow(pawn.group);
      }

   }
   
   // Updating Doors
   for(var i = 0; i < doorList.list.length; i++) {
      var door = doorList.list[i];
      door.lastUpdateWatch += game.time.physicsElapsed;
      if(door.dirty) {
         
         applyCoordToSprite(door.group, door);
         if(door.state == 'open') {
            door.sprite.frame = 1;
            door.spriteCover.frame = 16;
            door.spriteLight.visible = false;
            
         }
         else if(door.state == 'close') {
            door.sprite.frame = 0;
            door.spriteCover.frame = 15;
            door.spriteLight.visible = false;
         }
         else {
            var percent = getActionPercent(door.ticksLeft, 
                                           door.openSpeedTicks, 
                                           door.lastUpdateWatch, 
                                           updateTimeSeconds);
            door.spriteLight.visible = true;
            
            var offset = Math.floor(percent * (consts.door.animationLength - 1));
            if(door.state == 'opening') {

               door.sprite.frame = 2 + offset;
               door.spriteCover.frame = 17 + offset;
               door.spriteLight.frame = offset;
            }
            else if(door.state == 'closing') {
               door.sprite.frame = 2 + offset + consts.door.animationLength;
               door.spriteCover.frame = 17 + offset + consts.door.animationLength;
               door.spriteLight.frame = offset + consts.door.animationLength;
            }
            else if(door.state == 'nope') {
               door.sprite.frame = 0;
               door.spriteCover.frame = 15;
               door.spriteLight.frame = offset + (consts.door.animationLength * 2);
            }
         }
      }
   }
}

