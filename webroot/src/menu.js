


function Menu(game) {
   var self = this;

   var _list = [];
   var _headings = [];
   var _enabled = false;
   var _game = game;
   var _group = game.add.group();
   var _highlightedIndex = 0;
   var _selectedIndex = -1;
   var _state = 'ready';
   var _arrow = game.add.image(0, 0, "arrow");
   _group.visible = false;

   _group.add(_arrow);


   function readyDisplay() {
      // Sort the list
      _list = _list.sort(function(a, b) {
         if(a.heading == b.heading) {
            return a.index - b.index;
         }
         else {
            for(var i = 0; i < _headings.length; i++) {
               if(a.heading == _headings[i].name) {
                  return -1;
               }
               else if(b.heading == _headings[i].name) {
                  return 1;
               }
            }
            return 0;
         }
      });
      // Set the displays
      console.log("readyDisplay");
      var lIndex = 0;
      var y = 0;
      for(var i = 0; i < _headings.length; i++) {
         console.log("here");
         console.log(_headings[i].text);
         _headings[i].text.x = 0;
         _headings[i].text.y = y;
         y += 16;
         console.log(lIndex);
         while(lIndex < _list.length && _list[lIndex].heading == _headings[i].name) {
            console.log(_list[lIndex]);
            _list[lIndex].text.x = 16;
            _list[lIndex].text.y = y;
            y += 16;
            lIndex ++;
         }
      }
      
   }


   this.addToGroup = function(group) {
      group.add(_group);
   }

   this.addHeading = function(name) {
      var headingItem =  {};
      headingItem.name = name;
      headingItem.text = _game.make.text(-16, -16, name, {font: '16px Arial', fill: '#FFFFFF'});

      _group.add(headingItem.text); 

      _headings.push(headingItem);
   };
   this.addItem = function(name, result, heading) {
      var listItem = {
         name: name,
         result: result,
         heading: heading,
         index: _list.length
      };
      listItem.text = _game.make.text(0, 0, 
                             (_list.length + 1) + ": " + name, 
                             {font: '16px Arial', fill: '#FFFFFF'});
      _group.add(listItem.text); 

      _list.push(listItem);
   };

   this.clear = function() {
      _group.removeAll();
      _list = [];
      _group.add(_arrow);
      for(var i = 0; i < _headings.length; i++) {
         _group.add(_headings[i].text);
      }
   };

   this.setVisible = function(visible) {
      _group.visible = visible;
   };
   this.setEnabled = function(enable) {
      _enabled = enable;
      if(enable) {
         readyDisplay();
         _state = 'active';
         _group.visible = true;
         _highlightedIndex = 0;
         _arrow.y = _list[_highlightedIndex].text.y;
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

         _arrow.y = _list[_highlightedIndex].text.y;
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

