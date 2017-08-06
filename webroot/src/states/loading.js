/**
* Loading State loads in all of the in-game assets.
*
* Because in this blueprint there is only a single "hidden object" section
* we are going to load in all of the assets at this point.
*
* If you have multiple states, I would recommend loading the other graphics
* as they are required by their states.
* Otherwise the loading times may be a bit long and it is not optimal.
*/

/**
* Since we want to use the custom Kiwi.JS loader with the bobbing kiwi/html5
* logo, we need to extend the KiwiLoadingScreen State.
* The KiwiLoadingScreen State is an extension of a normal State,
* with some custom code to handle the loading/bobbing/fading of all the items,
* so if you override a method (e.g. the preload) make sure you call the
* super method.
* 
* The parameters we are passing into this method are as follows:
* 1 - name {string} Name of this state.
* 2 - stateToSwitch {string} Name of the state to switch to AFTER all the
*	assets have loaded. Note: The state you want to switch to should already
*	have been added to the game.
* 3 - dimensions {object} A Object containing the width/height that the game
*	is to be. For example `{width: 1024, height: 768}`
* 4 - subfolder {string} Folder that the loading graphics are located in
*/

var NodeStation = NodeStation || {};

NodeStation.Loading = new KiwiLoadingScreen(
	"Loading", "Intro", "assets/img/loading/" );


NodeStation.Loading.preload = function () {

	// Make sure to call the super at the top.
	// Otherwise the loading graphics will load last,
	// and that defies the whole point in loading them.
	KiwiLoadingScreen.prototype.preload.call(this);

	/**
	* Replace with your own in-game assets to load.
	**/
	this.addImage( "kiwiName", "assets/img/kiwijs-name.png" );
	this.addSpriteSheet( "icons", "assets/img/kiwijs-icons.png", 100, 90 );
   this.addImage("pawn",  "assets/img/female.png");
	this.addSpriteSheet( "mapTiles", "assets/img/mapTiles.png", 32, 32 );
   this.addSpriteSheet( "mapFloor", "assets/img/floors.png", 32, 32);
	this.addSpriteSheet( "items", "assets/img/items.png", 32, 32 );
	this.addSpriteSheet( "doors", "assets/img/doors.png", 32, 32 );
	this.addSpriteSheet( "pawnClothes", "assets/img/pawnClothes.png", 32, 32 );

   // Doors
   this.addSpriteSheet( "doorOverlays",            "assets/img/doors/overlays.png", 32, 32);
   this.addSpriteSheet( "doorAtmos",               "assets/img/doors/atmos.png", 32, 32);
   this.addSpriteSheet( "doorBananium",            "assets/img/doors/bananium.png", 32, 32);
   this.addSpriteSheet( "doorCommand",             "assets/img/doors/command.png", 32, 32);
   this.addSpriteSheet( "doorDiamond",             "assets/img/doors/diamond.png", 32, 32);
   this.addSpriteSheet( "doorEngineering",         "assets/img/doors/engineering.png", 32, 32);
   this.addSpriteSheet( "doorFreezer",             "assets/img/doors/freezer.png", 32, 32);
   this.addSpriteSheet( "doorGold",                "assets/img/doors/gold.png", 32, 32);
   this.addSpriteSheet( "doorMaintenance",         "assets/img/doors/maintenance.png", 32, 32);
   this.addSpriteSheet( "doorMaintenanceExternal", "assets/img/doors/maintenanceexternal.png", 32, 32);
   this.addSpriteSheet( "doorMedical",             "assets/img/doors/medical.png", 32, 32);
   this.addSpriteSheet( "doorMining",              "assets/img/doors/mining.png", 32, 32);
   this.addSpriteSheet( "doorPlasma",              "assets/img/doors/plasma.png", 32, 32);
   this.addSpriteSheet( "doorPublic",              "assets/img/doors/public.png", 32, 32);
   this.addSpriteSheet( "doorResearch",            "assets/img/doors/research.png", 32, 32);
   this.addSpriteSheet( "doorStandstone",          "assets/img/doors/sandstone.png", 32, 32);
   this.addSpriteSheet( "doorScience",             "assets/img/doors/science.png", 32, 32);
   this.addSpriteSheet( "doorSecurity",            "assets/img/doors/security.png", 32, 32);
   this.addSpriteSheet( "doorSilver",              "assets/img/doors/silver.png", 32, 32);
   this.addSpriteSheet( "doorUranium",             "assets/img/doors/uranium.png", 32, 32);
   this.addSpriteSheet( "doorVirology",            "assets/img/doors/virology.png", 32, 32);
   this.addSpriteSheet( "doorWood",                "assets/img/doors/wood.png", 32, 32);

   // Pawn
   this.addSpriteSheet( "pawnBodyParts", "assets/img/pawn/human_parts_greyscale.png", 32, 32);
   this.addSpriteSheet( "pawnFeet",      "assets/img/pawn/feet.png", 32, 32);
   this.addSpriteSheet( "pawnHands",     "assets/img/pawn/hands.png", 32, 32);
   this.addSpriteSheet( "pawnHead",      "assets/img/pawn/head.png", 32, 32);
   this.addSpriteSheet( "pawnFace",      "assets/img/pawn/human_face.png", 32, 32);
   this.addSpriteSheet( "pawnMask",      "assets/img/pawn/mask.png", 32, 32);
   this.addSpriteSheet( "pawnNeck",      "assets/img/pawn/neck.png", 32, 32);
   this.addSpriteSheet( "pawnSuit",      "assets/img/pawn/suit.png", 32, 32);
   this.addSpriteSheet( "pawnUnderwear", "assets/img/pawn/underwear.png", 32, 32);
   this.addSpriteSheet( "pawnUniform",   "assets/img/pawn/uniform.png", 32, 32);

};

