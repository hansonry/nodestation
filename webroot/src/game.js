/**
* The core NodeStation game file.
* 
* This file is only used to initalise (start-up) the main Kiwi Game 
* and add all of the relevant states to that Game.
*/

// Initialise the Kiwi Game. 

var gameOptions = {
	renderer: Kiwi.RENDERER_CANVAS,
	width: 640,
	height: 480,
   scaleType: Kiwi.Stage.SCALE_FIT
};

var game = new Kiwi.Game( "engineContent", "NodeStation", null, gameOptions );

// Add all the States we are going to use.
game.states.addState( NodeStation.Loading );
game.states.addState( NodeStation.Intro );
game.states.addState( NodeStation.Play );

game.states.switchState( "Loading" );



