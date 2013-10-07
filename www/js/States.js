var State = function(name){
	this.name = name;
	this.init = function(){};
  this.setInit = function(_init){
    this.init = _init;
  }
	this.layers = {};
  this.addLayer = function(layer_name, layer){
    this.layers[layer_name] = layer;
  }
}
var menu = new State("Menu");
menu.setInit(function(){

  menu.addLayer("hud", new Kinetic.Layer());

	var controllerOne = new GameController({
		id: "controllerOne",
		position: [32, 32],
		layer: this.layers.hud,
		btnPosition: [96, Game.screenHeight() - 96],
		//btnRotation: 45 
		btnRotation: 90 
	});

	var controllerTwo = new GameController({
		id: "controllerTwo",
		position: [Game.screenWidth() - 160, Game.screenHeight() - 160],
		layer: this.layers.hud,
		btnPosition: [Game.screenWidth() - 96, 96],
		//btnRotation: 225
		btnRotation: 270
	});

	var cw = 64, ch = 64;
	var animations = {
		idle: [
			{x: 0, y: 0, width: cw, height: ch }, 
			{x: cw, y: 0, width: cw, height: ch }, 
			{x: cw*2, y: 0, width: cw, height: ch }
		],
		walk: [
			{x: 0, y: ch, width: cw, height: ch }, 
			{x: cw, y: ch, width: cw, height: ch},
			{x: cw*2, y: ch, width: cw, height: ch},
			{x: cw*3, y: ch, width: cw, height: ch}
		]
	};

	var characterOne = new Mage({
		position: [96, Game.screenHeight()/2 - ch/2],
		offset: [cw/2, ch/2],
		width: 64, height: 64,
		image: Game.Sprites.character,
		animation: 'idle',
		animations: animations,
		id: "characterOne",
		layer: this.layers.hud,
		gameController: controllerOne,
		player: "ken",
		color: "blue",
		rotationDeg: 90, 
		direction: DIRECTION.EAST,
	});

	var characterTwo = new Mage({
		position: [Game.screenWidth() - 96, Game.screenHeight()/2 - ch/2],
		offset: [cw/2, ch/2],
		width: 64, height: 64,
		image: Game.Sprites.character,
		animation: 'idle',
		animations: animations,
		id: "characterTwo",
		layer: this.layers.hud,
		gameController: controllerTwo,
		player: "luke",
		color: "red",
		rotationDeg: 270,
		direction: DIRECTION.WEST
	});

	Game.addEntity(characterOne);
	Game.addEntity(characterTwo);

	//this.layers.hud.add(simpleText);
	//blob.setAnimation("walk"); 
	//blob.start();
});


