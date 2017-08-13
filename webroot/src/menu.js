


function Menu(game) {
   var self = this;

   var _list = [];
   var _enabled = false;
   var _game = game;
   var _group = game.add.group();
   var _highlightedIndex = 0;
   var _selectedIndex = -1;
   var _state = 'ready';
   var _arrow = game.add.image(0, 0, "arrow");
   _group.visible = false;

   _group.add(_arrow);



   this.addToGroup = function(group) {
      group.add(_group);
   }

   this.addItem = function(name, result) {
      var listItem = {
         name: name,
         result: result,
      };
      listItem.text = _game.make.text(16, _list.length * 16, 
                             (_list.length + 1) + ": " + name, 
                             {font: '16px Arial', fill: '#FFFFFF'});
      _group.add(listItem.text); 

      _list.push(listItem);
   };

   this.clear = function() {
      _group.removeAll();
      _list = [];
      _group.add(_arrow);
   };

   this.setVisible = function(visible) {
      _group.visible = visible;
   };
   this.setEnabled = function(enable) {
      _enabled = enable;
      if(enable) {
         _state = 'active';
         _group.visible = true;
         _highlightedIndex = 0;
         _arrow.y = _highlightedIndex * 16;
      }      
      else {
         _state = 'ready';
      }
   };
   this.setPosition = function(x, y) {
      _group.x = x;
      _group.y = y;
   }

   this.onKeyDown = function(e) {
      if(_enabled) {
         if(e.keyCode == Phaser.KeyCode.UP) {
            _highlightedIndex --;
            if(_highlightedIndex < 0) {
               _highlightedIndex = 0;
            }
         }
         else if(e.keyCode == Phaser.KeyCode.DOWN) {
            _highlightedIndex ++;
            if(_highlightedIndex >= _list.length) {
               _highlightedIndex = _list.length - 1;
            }
         }
         else if(e.keyCode == Phaser.KeyCode.ENTER) {
            _state = 'selected';
            _selectedIndex = _highlightedIndex;

         }
         else if(e.keyCode == Phaser.KeyCode.ESC) {
            _state = 'canceled';
         }

         _arrow.y = _highlightedIndex * 16;
      }
   };

   this.onKeyUp = function(e) {
      if(_enabled) {
      }
   };

   this.getStatus = function() {
      var result = {
         state: _state, 
         selectedIndex: _selectedIndex,
      };
      if(_selectedIndex >= 0 && _selectedIndex < _list.length) {
         result.result = _list[_selectedIndex].result;
      }
      return result;
   };

   this.getWidth = function() {
      var width = 0;
      for(var i = 0; i < _list.length; i++) {
         if(_list[i].text.width > width) {
            width = _list[i].text.width;
         }
      }

      return width + 16; // 16 is the size of the selector
   };


   return this;
}

