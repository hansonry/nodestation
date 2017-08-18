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


// Ajust the numbers here to change scaling
var game = new Phaser.Game(480, 320, Phaser.AUTO, 'engineContent',
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
   
   // Items
   game.load.spritesheet( "card", "assets/img/items/card.png", 32, 32 );
   
   // Clothing Items
   game.load.spritesheet( "clothingUniform", "assets/img/items/clothing/uniforms.png", 32, 32 );
   game.load.spritesheet( "clothingFeet",    "assets/img/items/clothing/shoes.png",    32, 32 );
   game.load.spritesheet( "clothingMask",    "assets/img/items/clothing/masks.png",    32, 32 );
   game.load.spritesheet( "clothingEyes",    "assets/img/items/clothing/glasses.png",  32, 32 );
   game.load.spritesheet( "clothingHead",    "assets/img/items/clothing/hats.png",     32, 32 );
   game.load.spritesheet( "clothingSuits",   "assets/img/items/clothing/suits.png",    32, 32 );

   // UI
   game.load.atlas( "screen", "assets/img/ui/screen_midnight.png", "assets/img/ui/screen_midnight_atlas.json");
	game.load.image( "arrow", "assets/img/ui/arrow.png");

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
   game.load.spritesheet( "pawnEyes",      "assets/img/pawn/eyes.png", 32, 32);
   game.load.spritesheet( "pawnEars",      "assets/img/pawn/ears.png", 32, 32);
}

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
   var hw = consts.tile.width  / 2;
   var hh = consts.tile.height / 2;
   
   offsetX = offsetX || 0;
   offsetY = offsetY || 0;


   sprite.x = Math.floor(coord.x * consts.tile.width  + offsetX + hw);
   sprite.y = Math.floor(coord.y * consts.tile.height + offsetY + hh);
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


var uiSlotImages = {
   handLeft:  {},
   handRight: {},
   card:      {},
   uniform:   {},
   suit:      {},
   head:      {},
   eyes:      {},
   mask:      {},
   ears:      {},
   feet:      {},
   hands:     {},
   neck:      {}
};


var menu = {
   inventory: {
      inMenu: false
   },
   examine: {
      inMenu: false
   }   
};


var socket = undefined;
var pawnList, itemList, tileList, doorList;
var typeSet;
var updateTimeSeconds = 0.05;
var ownedPawnId = '';
var ownedPawnIntent = 'help';
var groups = {};

function create() {

   game.world.setBounds(-2000, -2000, 4000, 4000);
   pawnList = new PawnList();
   itemList = new ItemList();
   tileList = new TileList();
   doorList = new DoorList();
   typeSet  = new TypeSet();

   buildTypeSet(typeSet); // Load in all the types

   groups.world = game.add.group();
   groups.ui = game.add.group();

   groups.map     = game.add.group(groups.world);   
   groups.item    = game.add.group(groups.world);
   groups.door    = game.add.group(groups.world);
   groups.pawn    = game.add.group(groups.world);
   groups.worldUi = game.add.group(groups.world);

   
   groups.pawn.scale.set(gameScale);
   groups.door.scale.set(gameScale);
   groups.item.scale.set(gameScale);


   // UI Setup
   var uiHarmSprite = game.add.image(0, 0, "screen", "help");

   
   function initSlotImage(slot, x, y, imageName, subImageName, group) {
      slot.background   = game.add.image(x, y, imageName, subImageName);
      slot.item         = game.add.image(x, y, imageName, subImageName);
      slot.item.visible = false;
      
      group.add(slot.background);
      group.add(slot.item);
   }
   
   initSlotImage(uiSlotImages.card,      32,  0, "screen", "idCardSlot", groups.ui);
   initSlotImage(uiSlotImages.handRight, 64,  0, "screen", "handRight",  groups.ui);
   initSlotImage(uiSlotImages.handLeft,  96,  0, "screen", "handLeft",   groups.ui);
   initSlotImage(uiSlotImages.uniform,   128, 0, "screen", "uniform",    groups.ui);
   initSlotImage(uiSlotImages.suit,      160, 0, "screen", "suit",       groups.ui);
   initSlotImage(uiSlotImages.head,      192, 0, "screen", "head",       groups.ui);
   initSlotImage(uiSlotImages.eyes,      224, 0, "screen", "eyes",       groups.ui);
   initSlotImage(uiSlotImages.mask,      256, 0, "screen", "mask",       groups.ui);
   initSlotImage(uiSlotImages.ears,      288, 0, "screen", "ears",       groups.ui);
   initSlotImage(uiSlotImages.feet,      320, 0, "screen", "feet",       groups.ui);
   initSlotImage(uiSlotImages.hands,     352, 0, "screen", "hands",      groups.ui);
   initSlotImage(uiSlotImages.neck,      384, 0, "screen", "neck",       groups.ui);
   
   
   // Inventory Menu
   menu.inventory.items = new Menu(game);
   menu.inventory.items.setPosition(0, 32);

   menu.inventory.actions = new Menu(game);

   menu.inventory.items.addHeading('Hands');
   menu.inventory.items.addHeading('Equipped');
   menu.inventory.actions.addHeading('Actions');
   
   menu.inventory.items.addToGroup(groups.ui);
   menu.inventory.actions.addToGroup(groups.ui);
   
   groups.ui.add(uiHarmSprite);
   groups.ui.fixedToCamera = true;

   // Examine Menu
   menu.examine.direction = new DirectionMenu(game);
   menu.examine.things    = new Menu(game);
   menu.examine.actions   = new Menu(game);
   
   menu.examine.things.setPosition(0, 32);
   
   menu.examine.things.addHeading('Items');
   menu.examine.things.addHeading('Furniture');
   menu.examine.things.addHeading('People');
   menu.examine.things.addHeading('Drop');
   
   menu.examine.actions.addHeading('Actions');
  
   
   menu.examine.direction.addToGroup(groups.worldUi);
   menu.examine.things.addToGroup(groups.ui);
   menu.examine.actions.addToGroup(groups.ui);

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
         var x = -consts.tile.width  / 2;
         var y = -consts.tile.height / 2;
         
         pawn.sprites.body.head = game.add.sprite(x, y, 'pawnBodyParts');
         //pawn.sprites.body.head.smoothed = false;
         pawn.sprites.body.body = game.add.sprite(x, y, 'pawnBodyParts');
         //pawn.sprites.body.body.smoothed = false;
         pawn.sprites.body.leftArm = game.add.sprite(x, y, 'pawnBodyParts');
         //pawn.sprites.body.leftArm.smoothed = false;
         pawn.sprites.body.rightArm = game.add.sprite(x, y, 'pawnBodyParts');
         //pawn.sprites.body.rightArm.smoothed = false;
         pawn.sprites.body.leftLeg = game.add.sprite(x, y, 'pawnBodyParts');
         //pawn.sprites.body.leftLeg.smoothed = false;
         pawn.sprites.body.rightLeg = game.add.sprite(x, y, 'pawnBodyParts');
         //pawn.sprites.body.rightLeg.smoothed = false;
         pawn.sprites.body.face = game.add.sprite(x, y, 'pawnFace');
         //pawn.sprites.body.face.smoothed = false;
         pawn.sprites.body.eyes = game.add.sprite(x, y, 'pawnFace');
         //pawn.sprites.body.eyes.smoothed = false;

         pawn.sprites.clothes.head = game.add.sprite(x, y, 'pawnHead');
         //pawn.sprites.clothes.head.smoothed = false;
         pawn.sprites.clothes.underwear = game.add.sprite(x, y, 'pawnUnderwear');
         //pawn.sprites.clothes.underwear.smoothed = false;
         pawn.sprites.clothes.feet = game.add.sprite(x, y, 'pawnFeet');
         //pawn.sprites.clothes.feet.smoothed = false;
         pawn.sprites.clothes.hands = game.add.sprite(x, y, 'pawnHands');
         //pawn.sprites.clothes.hands.smoothed = false;
         pawn.sprites.clothes.neck = game.add.sprite(x, y, 'pawnNeck');
         //pawn.sprites.clothes.neck.smoothed = false;
         pawn.sprites.clothes.uniform = game.add.sprite(x, y, 'pawnUniform');
         //pawn.sprites.clothes.uniform.smoothed = false;
         pawn.sprites.clothes.suit = game.add.sprite(x, y, 'pawnSuit');
         //pawn.sprites.clothes.suit.smoothed = false;
         pawn.sprites.clothes.mask = game.add.sprite(x, y, 'pawnMask');
         //pawn.sprites.clothes.mask.smoothed = false;
         pawn.sprites.clothes.eyes = game.add.sprite(x, y, 'pawnEyes');
         pawn.sprites.clothes.ears = game.add.sprite(x, y, 'pawnEars');



         pawn.group = game.add.group(groups.pawn);
         pawn.group.z2 = 0;
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
         
         pawn.group.addAt(pawn.sprites.clothes.eyes, 14);
         pawn.group.addAt(pawn.sprites.clothes.ears, 15);
         pawn.group.addAt(pawn.sprites.clothes.head, 16);
         pawn.group.addAt(pawn.sprites.clothes.suit, 17); 

         
         pawn.x = msg.x;
         pawn.y = msg.y;
         pawn.facing = msg.facing;
         pawn.health = msg.health;


         pawn.inventorySlots.handLeft  = msg.inventorySlots.handLeft;
         pawn.inventorySlots.handRight = msg.inventorySlots.handRight;
         pawn.inventorySlots.card      = msg.inventorySlots.card;
         pawn.inventorySlots.uniform   = msg.inventorySlots.uniform;
         pawn.inventorySlots.suit      = msg.inventorySlots.suit;
         pawn.inventorySlots.head      = msg.inventorySlots.head;
         pawn.inventorySlots.eyes      = msg.inventorySlots.eyes;
         pawn.inventorySlots.mask      = msg.inventorySlots.mask;
         pawn.inventorySlots.ears      = msg.inventorySlots.ears;
         pawn.inventorySlots.feet      = msg.inventorySlots.feet;
         pawn.inventorySlots.hands     = msg.inventorySlots.hands;
         pawn.inventorySlots.neck      = msg.inventorySlots.neck;

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
      ownedPawnIntent = msg.intent;
      if(ownedPawnIntent == 'help') {
         uiHarmSprite.frameName = 'help';
      }
      else if(ownedPawnIntent == 'harm') {
         uiHarmSprite.frameName = 'harm';
      }
   });
   socket.on('updatePawn', function(msg) {
      var pawnIndex = self.pawnList.findById(msg.id);
      if(pawnIndex >= 0)
      {
         var pawn = self.pawnList.list[pawnIndex];

         pawn.motion.state          = msg.motion.state;
         pawn.motion.ticksLeft      = msg.motion.ticksLeft;
         pawn.motion.ticksTotal     = msg.motion.ticksTotal;
         pawn.motion.target.x       = msg.motion.target.x;
         pawn.motion.target.y       = msg.motion.target.y;
         pawn.lastUpdateWatch       = 0;
         pawn.x                     = msg.x;
         pawn.y                     = msg.y;
         pawn.facing                = msg.facing;
         pawn.health                = msg.health;
         pawn.drag.type             = msg.drag.type;
         pawn.drag.id               = msg.drag.id;

         pawn.inventorySlots.handLeft  = msg.inventorySlots.handLeft;
         pawn.inventorySlots.handRight = msg.inventorySlots.handRight;
         pawn.inventorySlots.card      = msg.inventorySlots.card;
         pawn.inventorySlots.uniform   = msg.inventorySlots.uniform;
         pawn.inventorySlots.suit      = msg.inventorySlots.suit;
         pawn.inventorySlots.head      = msg.inventorySlots.head;
         pawn.inventorySlots.eyes      = msg.inventorySlots.eyes;
         pawn.inventorySlots.mask      = msg.inventorySlots.mask;
         pawn.inventorySlots.ears      = msg.inventorySlots.ears;
         pawn.inventorySlots.feet      = msg.inventorySlots.feet;
         pawn.inventorySlots.hands     = msg.inventorySlots.hands;
         pawn.inventorySlots.neck      = msg.inventorySlots.neck;

         //console.log(pawn.inventorySlots);

         pawn.dirty = true;

      }
   });
   socket.on('addItem', function(msg) {
      var x = -consts.tile.width  / 2;
      var y = -consts.tile.height / 2;
      var item = self.itemList.add(msg.id, msg.x, msg.y);
      typeSet.initItem(item, msg.type);
      item.sprite = game.add.sprite(x, y, item.render.icon.image);
      item.sprite.frame = item.render.icon.index;

      item.group = game.add.group(groups.item);
      item.group.add(item.sprite);

      applyCoordToSprite(item.group, item);

      item.inventory.id = msg.inventory.id;

      if(item.inventory.id == '') {
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
         var item = pawnList.list[itemIndex];
         groups.item.remove(item.group, true);
         self.pawnList.remove(itemIndex);
      }
   });
   socket.on('updateItem', function(msg) {
      var itemIndex = self.itemList.findById(msg.id);
      if(itemIndex >= 0)
      {
         var item = self.itemList.list[itemIndex];
         item.x = msg.x;
         item.y = msg.y;
         item.inventory.id = msg.inventory.id;
                  
         applyCoordToSprite(item.group, item);
         if(item.inventory.id == '') {
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
      var x = -consts.tile.width  / 2;
      var y = -consts.tile.height / 2;

      door.group = game.add.group(groups.door);
      door.sprite = game.add.sprite(x, y, doorType.spriteSheet);
      door.spriteCover = game.add.sprite(x, y, doorType.spriteSheet);
      door.spriteLight = game.add.sprite(x, y, 'doorOverlays');

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
         door.ticksTotal = msg.ticksTotal;
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

         menu.inventory.items.onKeyDown(e);
         menu.inventory.actions.onKeyDown(e);
         menu.examine.direction.onKeyDown(e);
         menu.examine.things.onKeyDown(e);
         menu.examine.actions.onKeyDown(e);

         if(!menu.inventory.inMenu && !menu.examine.inMenu) {
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
            else if(e.keyCode == Phaser.KeyCode.H) {
               socket.emit('intent', {type: 'switch'});
            }
            else if(e.keyCode == Phaser.KeyCode.I) {
               pawnInventory();
            }
            else if(e.keyCode == Phaser.KeyCode.E) {               
               examine();
            }

            if(key) {
               socket.emit('key', { event: 'down', key: key });
            }
         }
      }
   };
   game.input.keyboard.onUpCallback = function() {
      var e = game.input.keyboard.event;
      var key = undefined;
      menu.inventory.items.onKeyUp(e);
      menu.inventory.actions.onKeyUp(e);
      menu.examine.direction.onKeyUp(e);
      menu.examine.things.onKeyUp(e);
      menu.examine.actions.onKeyUp(e);

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

function rawGrab(type, id) {
   var msg = {
      type: type,
      id: id
   };
   socket.emit('grab', msg);
}

function pawnGrab() {
   var ownedPawnIndex = pawnList.findById(ownedPawnId);
   if(ownedPawnIndex >= 0) {
      var ownedPawn = pawnList.list[ownedPawnIndex];
      // find the item we are over
      var itemIndex = itemList.findByCoord(ownedPawn.x, ownedPawn.y);
      if(itemIndex >= 0) {
         var item = itemList.list[itemIndex];
         rawGrab('item', item.id);
      }
   }
}


function rawDrop(type, id, x, y) {
   var msg = {
      type: type,
      id: id,
      x: x,
      y: y
   };
   socket.emit('drop', msg);
   //console.log(msg);
}


function pawnDrop() {
   var ownedPawnIndex = pawnList.findById(ownedPawnId);
   if(ownedPawnIndex >= 0) {
      var ownedPawn = pawnList.list[ownedPawnIndex];
      // find an item to drop in the hands
      var itemId = ownedPawn.inventorySlots.handRight;
      if(itemId == '') {
         itemId = ownedPawn.inventorySlots.handLeft;
      }

      var itemIndex = itemList.findById(itemId);
      if(itemIndex >= 0) {
         var item = itemList.list[itemIndex];
         if(item.inventory.id == ownedPawn.id) {
            rawDrop('item', item.id, ownedPawn.x, ownedPawn.y);
         }
      }
   }
}


function rawInternalMove(itemId, destSlot) {
   var msg = {
      itemId: itemId,
      destSlot: destSlot
   };
   //console.log(msg);
   socket.emit('internalMove', msg);
}

function rawPawnStrip(targetPawnId) {
   var msg = {
      targetPawnId: targetPawnId
   };
   socket.emit('strip', msg);
}


function pawnInventory() {
   menu.inventory.items.clear();

   var pawnIndex = pawnList.findById(ownedPawnId);
   if(pawnIndex >= 0) {
      var pawn = pawnList.list[pawnIndex];
      var items = [];
      itemList.findAllByInventroyId(ownedPawnId, items);
      
      for(var i = 0; i < items.length; i ++) {
         if(items[i].id == pawn.inventorySlots.handRight ||
            items[i].id == pawn.inventorySlots.handLeft) {
            menu.inventory.items.addItem(items[i].name, items[i].id, 'Hands');
         }
         else {
            menu.inventory.items.addItem(items[i].name, items[i].id, 'Equipped');
         }
      }
      menu.inventory.items.setEnabled(true);
      menu.inventory.inMenu = true;
   }
}

function examine() {
   var pawnIndex = pawnList.findById(ownedPawnId);
   if(pawnIndex >= 0) {
      var pawn = pawnList.list[pawnIndex];
      
      menu.examine.direction.setPawnPosition(pawn.group.x, pawn.group.y);
      menu.examine.direction.setEnabled(true);
      menu.examine.inMenu = true;
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

   // Handel Inventory Menu
   var ownedPawnIndex = pawnList.findById(ownedPawnId);
   if(menu.inventory.inMenu) {
      if(ownedPawnIndex < 0) {
         menu.inventory.items.setVisible(false);
         menu.inventory.items.setEnabled(false);
         menu.inventory.actions.setVisible(false);
         menu.inventory.actions.setEnabled(false);
         menu.inventory.inMenu = false;
      }
      else {
         var ownedPawn = pawnList.list[ownedPawnIndex];
         var uiInventoryResults       = menu.inventory.items.getStatus();
         var uiInventoryActionResults = menu.inventory.actions.getStatus();
         
         if(uiInventoryResults.state == 'canceled') {
            menu.inventory.items.setVisible(false);
            menu.inventory.items.setEnabled(false);
            menu.inventory.inMenu = false;
         } else if(uiInventoryResults.state == 'selected') {
            menu.inventory.items.setEnabled(false);
            var itemId = uiInventoryResults.result;
            var itemIndex = itemList.findById(itemId);
            if(itemIndex < 0) {
               menu.inventory.inMenu = false;
               menu.inventory.items.setVisible(false);
            }
            else {
               var item = itemList.list[itemIndex];
               if(item.inventory.id == ownedPawnId) {
                  var width = menu.inventory.items.getWidth();
                  menu.inventory.actions.setPosition(width, 32);
                  menu.inventory.actions.clear();

                  
                  // Can it be equipped?
                  if(item.pawnSlotType != '') {

                     var slot = ownedPawn.inventorySlots[item.pawnSlotType];
                     if(slot == '') {
                        menu.inventory.actions.addItem('Equip', 'equip', 'Actions');
                     }
                     else if(slot == item.id && 
                        (ownedPawn.inventorySlots.handLeft == '' || 
                        ownedPawn.inventorySlots.handRight == '')) {
                        menu.inventory.actions.addItem('Unequip', 'unequip', 'Actions');
                     }
                  }
                  // Only drop things in our hand
                  if(ownedPawn.inventorySlots.handRight == item.id ||
                     ownedPawn.inventorySlots.handLeft == item.id) {
                     menu.inventory.actions.addItem('Drop', 'drop', 'Actions');
                  }

                  
                  
                  menu.inventory.actions.setEnabled(true);
               }
               else {
                  menu.inventory.inMenu = false;
                  menu.inventory.items.setVisible(false);
               }
            }
         }
         if(uiInventoryActionResults.state == 'canceled') {
            menu.inventory.items.setVisible(false);
            menu.inventory.items.setEnabled(false);
            menu.inventory.actions.setVisible(false);
            menu.inventory.actions.setEnabled(false);
            menu.inventory.inMenu = false;
         }
         else if(uiInventoryActionResults.state == 'selected') {
            menu.inventory.items.setVisible(false);
            menu.inventory.items.setEnabled(false);
            menu.inventory.actions.setVisible(false);
            menu.inventory.actions.setEnabled(false);
            var itemIndex = itemList.findById(uiInventoryResults.result);
            if(itemIndex >= 0) {
               var item = itemList.list[itemIndex];
               if(uiInventoryActionResults.result == 'drop') {      
                  rawDrop('item', item.id, ownedPawn.x, ownedPawn.y);
               }
               else if(uiInventoryActionResults.result == 'equip') {
                  rawInternalMove(item.id, item.pawnSlotType);

               }
               else if(uiInventoryActionResults.result == 'unequip') {
                  if(ownedPawn.inventorySlots.handRight == '') {
                     rawInternalMove(item.id, 'handRight');
                  }
                  else if(ownedPawn.inventorySlots.handLeft == '') {
                     rawInternalMove(item.id, 'handLeft');
                  }
               }
            }
            menu.inventory.inMenu = false;
         }
      }
   }
   // Examine Menu
   if(menu.examine.inMenu) {
      if(ownedPawnIndex < 0) {
         menu.examine.direction.setEnabled(false);
         menu.examine.direction.setVisible(false);
         menu.examine.things.setEnabled(false);
         menu.examine.things.setVisible(false); 
         menu.examine.inMenu = false;
      }
      else {
         var ownedPawn = pawnList.list[ownedPawnIndex];
         
         var dirResults     = menu.examine.direction.getStatus();
         var thingResults   = menu.examine.things.getStatus();
         var actionsResults = menu.examine.actions.getStatus();
         if(dirResults.state == 'selected') {
            menu.examine.direction.setEnabled(false);
            menu.examine.things.clear();
            var coordItemList = [];
            var coords = menu.examine.direction.getSelectedCoord(ownedPawn.x, ownedPawn.y);
            itemList.findAllByCoord(coords.x, coords.y, coordItemList);
            
            for(var i = 0; i < coordItemList.length; i++) {
               var item = coordItemList[i];
               menu.examine.things.addItem(item.name, item.id, 'Items');               
            }
            var items = [];
            itemList.findAllByInventroyId(ownedPawnId, items);
            
            for(var i = 0; i < items.length; i ++) {
               if(items[i].id == ownedPawn.inventorySlots.handRight ||
                  items[i].id == ownedPawn.inventorySlots.handLeft) {
                  menu.examine.things.addItem(items[i].name, items[i].id, 'Drop');
               }
            }
            
            var pawns = [];
            pawnList.findAllByCoord(coords.x, coords.y, pawns);
            for(var i = 0; i < pawns.length; i ++) {
               var pawn = pawns[i];
               menu.examine.things.addItem(pawn.id, pawn.id, 'People');
            }

            
            menu.examine.things.setEnabled(true);
         }
         else if(dirResults.state == 'canceled') {
            menu.examine.direction.setEnabled(false);
            menu.examine.direction.setVisible(false);
            menu.examine.inMenu = false;
         }
         
         if(thingResults.state == 'selected') {
            menu.examine.things.setEnabled(false);
            var width = menu.examine.things.getWidth();
            menu.examine.actions.setPosition(width, 32);
            menu.examine.actions.clear();

            
            if(thingResults.heading == 'Drop') {
               var coords = menu.examine.direction.getSelectedCoord(ownedPawn.x, ownedPawn.y);
               rawDrop('item', thingResults.result, coords.x, coords.y);
               menu.examine.direction.setVisible(false);
               menu.examine.things.setEnabled(false);
               menu.examine.things.setVisible(false); 
               menu.examine.inMenu = false;
            }
            else if(thingResults.heading == 'Items') {
               
               if(ownedPawn.inventorySlots.handLeft  == '' || 
                  ownedPawn.inventorySlots.handRight == '') {
                  menu.examine.actions.addItem('Pickup', 'pickup', 'Actions');
               }
               menu.examine.actions.setEnabled(true);
            }
            else if(thingResults.heading == 'People') {
               if(ownedPawn.drag.type == '') {
                  menu.examine.actions.addItem('Drag', 'drag', 'Actions');
               }
               else if(ownedPawn.drag.type == 'pawn' && ownedPawn.drag.id == thingResults.result) {
                  menu.examine.actions.addItem('Let Go', 'drop', 'Actions');
               }
               menu.examine.actions.addItem('Strip', 'strip', 'Actions');
               menu.examine.actions.setEnabled(true);
            }
         }
         else if(thingResults.state == 'canceled') {
            menu.examine.direction.setEnabled(false);
            menu.examine.direction.setVisible(false);
            menu.examine.things.setEnabled(false);
            menu.examine.things.setVisible(false); 
            menu.examine.inMenu = false;
         }
         
         if(actionsResults.state == 'selected') {
            if(actionsResults.result == 'pickup') {
               rawGrab('item', thingResults.result);
               menu.examine.direction.setEnabled(false);
               menu.examine.direction.setVisible(false);
               menu.examine.things.setEnabled(false);
               menu.examine.things.setVisible(false); 
               menu.examine.actions.setEnabled(false);
               menu.examine.actions.setVisible(false); 
               menu.examine.inMenu = false;

            }
            else if(actionsResults.result == 'drag') {
               rawGrab('pawn', thingResults.result);
               menu.examine.direction.setEnabled(false);
               menu.examine.direction.setVisible(false);
               menu.examine.things.setEnabled(false);
               menu.examine.things.setVisible(false); 
               menu.examine.actions.setEnabled(false);
               menu.examine.actions.setVisible(false); 
               menu.examine.inMenu = false;               
            }
            else if(actionsResults.result == 'strip') {
               rawPawnStrip(thingResults.result);
               menu.examine.direction.setEnabled(false);
               menu.examine.direction.setVisible(false);
               menu.examine.things.setEnabled(false);
               menu.examine.things.setVisible(false); 
               menu.examine.actions.setEnabled(false);
               menu.examine.actions.setVisible(false); 
               menu.examine.inMenu = false;
            }
            else if(actionsResults.result == 'drop') {
               rawDrop('pawn', thingResults.result);
               menu.examine.direction.setEnabled(false);
               menu.examine.direction.setVisible(false);
               menu.examine.things.setEnabled(false);
               menu.examine.things.setVisible(false); 
               menu.examine.actions.setEnabled(false);
               menu.examine.actions.setVisible(false); 
               menu.examine.inMenu = false;               
            }
         }
         else if(actionsResults.state == 'canceled') {
            menu.examine.direction.setEnabled(false);
            menu.examine.direction.setVisible(false);
            menu.examine.things.setEnabled(false);
            menu.examine.things.setVisible(false); 
            menu.examine.actions.setEnabled(false);
            menu.examine.actions.setVisible(false); 
            menu.examine.inMenu = false;
         }
      }
   }
   
   // Handel Examine Menu
   

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
                                        pawn.motion.ticksTotal, 
                                        pawn.lastUpdateWatch, 
                                        updateTimeSeconds);


         var dx = pawn.motion.target.x - pawn.x;
         var dy = pawn.motion.target.y - pawn.y;

         var offsetX = consts.tile.width  * percent * dx;
         var offsetY = consts.tile.height * percent * dy;

         applyCoordToSprite(pawn.group, pawn, offsetX, offsetY);

      }
      else if(pawn.motion.state == 'attacking') {

         var percent = getActionPercent(pawn.motion.ticksLeft, 
                                        pawn.motion.ticksTotal, 
                                        pawn.lastUpdateWatch, 
                                        updateTimeSeconds);


         var dx = pawn.motion.target.x - pawn.x;
         var dy = pawn.motion.target.y - pawn.y;

         var offsetX;
         var offsetY;
         if(percent < 0.5) {
            offsetX = consts.tile.width  * percent * dx;
            offsetY = consts.tile.height * percent * dy;
         }
         else {
            offsetX = consts.tile.width  * (1 - percent) * dx;
            offsetY = consts.tile.height * (1 - percent) * dy;
         }

         applyCoordToSprite(pawn.group, pawn, offsetX, offsetY);

      }
      else if(pawn.dirty) {
         applyCoordToSprite(pawn.group, pawn);
      }

      if(pawn.dirty) {
         
         function updatePawnAppearance(pawn, slotName) {
            var slot = pawn.inventorySlots[slotName];
            if(slot == '') {
               pawn.cellIndices.clothes[slotName] = -1;
            }
            else {
               var itemIndex = itemList.findById(slot);
               if(itemIndex >= 0) {
                  var item = itemList.list[itemIndex];
                  if(item.pawnVisible) {
                     pawn.cellIndices.clothes[slotName] = item.render.pawn.index;
                  } else {
                     pawn.cellIndices.clothes[slotName] = -1;
                  }
               }
               else {
                  pawn.cellIndices.clothes[slotName] = -1;
               }
            }
         }
         
         updatePawnAppearance(pawn, 'uniform');
         updatePawnAppearance(pawn, 'suit');
         updatePawnAppearance(pawn, 'head');
         updatePawnAppearance(pawn, 'eyes');
         updatePawnAppearance(pawn, 'mask');
         updatePawnAppearance(pawn, 'ears');
         updatePawnAppearance(pawn, 'feet');
         updatePawnAppearance(pawn, 'hands');
         updatePawnAppearance(pawn, 'neck');
         
         pawn.updateCellIndices(facingOffset);

         if(pawn.health > 0) {
            pawn.group.angle = 0;
         }
         else {
            pawn.group.angle = -90;
         }

         if(pawn.id == ownedPawnId) {

            function updateInventoryIcon(slot, image) {
               if(slot == '') {
                  image.visible = false;
               }
               else {
                  var itemIndex = itemList.findById(slot);
                  if(itemIndex >= 0) {
                  var item = itemList.list[itemIndex];
                     image.loadTexture(item.render.icon.image, item.render.icon.index);
                     image.visible = true;
                  }
               }
            }
            updateInventoryIcon(pawn.inventorySlots.handRight, uiSlotImages.handRight.item);
            updateInventoryIcon(pawn.inventorySlots.handLeft,  uiSlotImages.handLeft.item);
            updateInventoryIcon(pawn.inventorySlots.card,      uiSlotImages.card.item);
            updateInventoryIcon(pawn.inventorySlots.uniform,   uiSlotImages.uniform.item);
            updateInventoryIcon(pawn.inventorySlots.suit,      uiSlotImages.suit.item);
            updateInventoryIcon(pawn.inventorySlots.head,      uiSlotImages.head.item);
            updateInventoryIcon(pawn.inventorySlots.eyes,      uiSlotImages.eyes.item);
            updateInventoryIcon(pawn.inventorySlots.mask,      uiSlotImages.mask.item);
            updateInventoryIcon(pawn.inventorySlots.ears,      uiSlotImages.ears.item);
            updateInventoryIcon(pawn.inventorySlots.feet,      uiSlotImages.feet.item);
            updateInventoryIcon(pawn.inventorySlots.hands,     uiSlotImages.hands.item);
            updateInventoryIcon(pawn.inventorySlots.neck,      uiSlotImages.neck.item);
         }
         
         
         pawn.dirty = false;

         pawn.group.z2 = pawn.group.y;
         if(pawn.health <= 0) {
            // If your dead move you way back on the z sort
            pawn.group.z2 -= consts.tile.height;
         }
      }
      if(pawn.id == ownedPawnId) {
         // Setup the Camera
         game.camera.follow(pawn.group);
         if(pawn.health > 0) {
            // The player always get highest visible priorty
            pawn.group.z2 ++;
         }
      }

   }
   groups.pawn.sort('z2', Phaser.Group.SORT_ASCENDING);
   
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
                                           door.ticksTotal, 
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

