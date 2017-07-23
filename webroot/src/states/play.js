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

var socket = undefined;
NodeStation.Play.create = function () {

	Kiwi.State.prototype.create.call( this );
   var self = this;

   this.list = [];

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
	this.addChild( this.heart );
	this.addChild( this.crown );
	//this.addChild( this.shield );
	this.addChild( this.bomb );
	this.addChild( this.name );

   
   // Connect to socket.io
   socket = io();
   socket.on('addPawn', function(msg) {
      shield = new Kiwi.GameObjects.Sprite(
         self, self.textures.icons, 200, 200 );
	   shield.cellIndex = 9;
      self.list.push(shield);
      self.addChild(shield);
      shield.id = msg.id;
      shield.x  = msg.x;
      shield.y  = msg.y;
   });
   socket.on('removePawn', function(msg) {
      for(var i = 0; i < self.list.length; i++) {
         if(self.list[i].id == msg.id) {
            self.removeChild(self.list[i]);
            self.list.splice(i, 1);
            break;
         }
      }
   });
   socket.on('updatePawn', function(msg) {
      for(var i = 0; i < self.list.length; i++) {
         var shield = self.list[i];
         if(shield.id == msg.id) {
            shield.x = msg.x;
            shield.y = msg.y;
            break;
         }
      }
   });

   // Input
   this.game.input.keyboard.onKeyDownOnce.add(this.keyDownOnce, this);
   this.game.input.keyboard.onKeyUp.add(this.keyUp, this);
};

NodeStation.Play.keyDownOnce = function(keyCode, key) {
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


NodeStation.Play.update = function() {

	Kiwi.State.prototype.update.call( this );
   
   for(var i = 0; i < this.list.length; i++) {
	   this.list[i].rotation += this.game.time.clock.rate * 0.01;
   }
};

