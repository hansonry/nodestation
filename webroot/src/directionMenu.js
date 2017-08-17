
function DirectionMenu(game) {
   var self = this;
   var _group = game.add.group();
   var _arrow = {
      north: game.add.image( 0,  -16, "arrow"),
      east:  game.add.image( 16,  0,  "arrow"),
      south: game.add.image( 0,   16, "arrow"),
      west:  game.add.image(-16,  0,  "arrow")
   };
   
   var _state = 'ready';
   var _selectedDirection = 'none';
   var _enabled = false;
   
   _arrow.north.anchor.setTo(0.5, 0.5);
   _arrow.east.anchor.setTo(0.5, 0.5);
   _arrow.south.anchor.setTo(0.5, 0.5);
   _arrow.west.anchor.setTo(0.5, 0.5);
   
   _arrow.north.angle = -90;
   _arrow.east.angle  =  0;
   _arrow.south.angle =  90;
   _arrow.west.angle  =  180;
   
   _group.add(_arrow.north);
   _group.add(_arrow.east);
   _group.add(_arrow.south);
   _group.add(_arrow.west);
   
   _group.visible = false;
   
   this.setPawnPosition = function(worldX, worldY) {
      _group.x = worldX;
      _group.y = worldY;
   }
   
   this.addToGroup = function(group) {
      group.add(_group);
   }
   this.setVisible = function(visible) {
      _group.visible = visible;
      if(!visible) {
         _selectedDirection = 'none';
         _arrow.north.visible = true;
         _arrow.east.visible = true;
         _arrow.south.visible = true;
         _arrow.west.visible = true;
      }

   };
   this.setEnabled = function(enable) {
      _enabled = enable;
      if(enable) {
         _state = 'active';
         _group.visible = true;
      }      
      else {
         _state = 'ready';         
      }
   };
   
   this.onKeyDown = function(e) {
      if(_enabled) {
         if(e.keyCode == Phaser.KeyCode.UP) {
            _state = 'selected';
            _selectedDirection = 'north';
            _arrow.north.visible = true;
            _arrow.east.visible = false;
            _arrow.south.visible = false;
            _arrow.west.visible = false;
         }
         else if(e.keyCode == Phaser.KeyCode.DOWN) {
            _state = 'selected';
            _selectedDirection = 'south';
            _arrow.north.visible = false;
            _arrow.east.visible = false;
            _arrow.south.visible = true;
            _arrow.west.visible = false;
         }
         else if(e.keyCode == Phaser.KeyCode.LEFT) {
            _state = 'selected';
            _selectedDirection = 'west';
            _arrow.north.visible = false;
            _arrow.east.visible = false;
            _arrow.south.visible = false;
            _arrow.west.visible = true;
         }
         else if(e.keyCode == Phaser.KeyCode.RIGHT) {
            _state = 'selected';
            _selectedDirection = 'east';
            _arrow.north.visible = false;
            _arrow.east.visible = true;
            _arrow.south.visible = false;
            _arrow.west.visible = false;

         }
         else if(e.keyCode == Phaser.KeyCode.ESC) {
            _state = 'canceled';
         }
      }
   };

   this.onKeyUp = function(e) {
      if(_enabled) {
      }
   };
   
   this.getStatus = function() {
      var result = {
         state: _state, 
         selectedDirection: _selectedDirection,
      };
      return result;
   };
   
   this.getSelectedCoord = function(sourceX, sourceY) {
      var out = {x: 0, y: 0};
      if(_selectedDirection == 'none') {
         out.x = sourceX;
         out.y = sourceY;
      }
      else if(_selectedDirection == 'north') {
         out.x = sourceX;
         out.y = sourceY - 1;
      }
      else if(_selectedDirection == 'east') {
         out.x = sourceX + 1;
         out.y = sourceY;
      }
      else if(_selectedDirection == 'south') {
         out.x = sourceX;
         out.y = sourceY + 1;
      }
      else if(_selectedDirection == 'west') {
         out.x = sourceX - 1;
         out.y = sourceY;
      }
      return out;
   }
   
   return this;
}