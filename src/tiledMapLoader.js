

function tiledMapLoader(rawMap, tileList, itemList, doorList, shortid) {
   // Map Conversion
   if(rawMap.type != 'map') {
      throw 'rawMap is not a map';
   }

   tileList.resize(rawMap.width, rawMap.height);
   
   // Find Tilesets
   var tilesetFloors = undefined;
   var tilesetWalls = undefined;
   var tilesetItems = undefined;

   for(var i = 0; i < rawMap.tilesets.length; i++) {
      var tileset = rawMap.tilesets[i];
      if(tileset.name == "Floors") {
         tilesetFloors = tileset;
      }
      else if(tileset.name == "Walls") {
         tilesetWalls = tileset;
      }
      else if(tileset.name == "Items") {
         tilesetItems = tileset;
      }
      else {
         throw "Unexpected Tileset: " + tileset.name;
      }
   }
   
   if(tilesetFloors == undefined) {
      throw 'Failed to find Tileset "Floors"'
   }
   if(tilesetFloors == undefined) {
      throw 'Failed to find Tileset "Walls"'
   }
   if(tilesetItems == undefined) {
      throw 'Failed to find Tileset "Items"';
   }

   for(var i = 0; i < rawMap.layers.length; i++) {
      var layer = rawMap.layers[i];
      if(layer.type == 'group') {
         if(layer.name == 'Floor') {            
            var tileset = tilesetFloors;
            var groupOffset = { x: layer.x, y: layer.y };
            for(var k = 0; k < layer.layers.length; k++) {
               var tileLayer = layer.layers[k];
               if(tileLayer.type != 'tilelayer') {
                  throw 'Expected TileLayer';
               }
               var offset = {
                  x: groupOffset.x + tileLayer.x, 
                  y: groupOffset.y + tileLayer.y
               };
               var x = 0;
               var y = 0;
               for(var m = 0; m < tileLayer.data.length; m ++) {
                  var gid = tileLayer.data[m];
                  if(gid > 0) {
                     tileList.add(gid - tileset.firstgid, 
                                  x + offset.x, y + offset.y, 'floor');
                  }
                  
                  x ++;
                  if(x >= tileLayer.width) {
                     x = 0;
                     y ++;
                  }
               }
            }
         }
         else if(layer.name == 'Wall') {
            var tileset = tilesetWalls;
            var groupOffset = { x: layer.x, y: layer.y };
            for(var k = 0; k < layer.layers.length; k++) {
               var tileLayer = layer.layers[k];
               if(tileLayer.type != 'tilelayer') {
                  throw 'Expected TileLayer';
               }
               var offset = {
                  x: groupOffset.x + tileLayer.x, 
                  y: groupOffset.y + tileLayer.y
               };
               var x = 0;
               var y = 0;
               for(var m = 0; m < tileLayer.data.length; m ++) {
                  var gid = tileLayer.data[m];
                  var tile = tileset.tiles[gid - tileset.firstgid];
                  if(gid > 0) {
                     if(tile.type == 'door') {
                        doorList.add(x + offset.x, y + offset.y);
                     }
                     else {
                        tileList.add(tile.type, x + offset.x, y + offset.y, 
                                     'wall');
                     }
                  }
                  
                  x ++;
                  if(x >= tileLayer.width) {
                     x = 0;
                     y ++;
                  }
               }
            }
         }
         else {
            throw "Unknown Group Name: " + layer.name;
         }

      }
      else if(layer.type == 'objectgroup' && layer.name == 'Item') { // Items
         var tileset = tilesetItems;
         for(var k = 0; k < layer.objects.length; k++) {
            var object = layer.objects[k];
            var type = tileset.tiles[object.gid - tileset.firstgid].type;
            // Items in tiled have origin in the lower left corner
            var x = Math.floor((object.x + 15) / 32);
            var y = Math.floor((object.y - 15) / 32);
            if(type == 'idCard') {               
               var item = itemList.add(shortid.generate(), 'idCard');
               item.x = x;
               item.y = y;

            }
         }
      }
      else {
         throw "Unexpected Layer Type: " + layer.type + " With name: " + layer.name;
      }
   }

}


module.exports = {
   load: tiledMapLoader   
};
