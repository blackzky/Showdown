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
  var simpleText = new Kinetic.Text({
    x: (Game.screenWidth() / 2),
    y: 15,
    text: 'Simple Text',
    fontSize: 30,
    fontFamily: 'Calibri',
    fill: 'green',
    id: "text"
  });

	var a_width = 64,
	a_height = 64;
	var animations = {
		idle: [{
			x: 0, y: 0, width: a_width, height: a_height
		}, {
			x: a_width, y: 0, width: a_width, height: a_height 
		}, {
			x: a_width * 2, y: 0, width: a_width, height: a_height 
		}],
		walk: [{
			x: 0, y: a_height, width: a_width, height: a_height 
		}, {
			x: a_width, y: a_height, width: a_width, height: a_height 
		}, {
			x: a_width * 2, y: a_height, width: a_width, height: a_height 
		}, {
			x: a_width * 3, y: a_height, width: a_width, height: a_height 
		}]
	};

	var blob = new Kinetic.Sprite({
		x: Game.screenWidth()/2 + a_width/2, y: Game.screenHeight()/2 - a_height/2,
		offset: [a_width/2, a_height/2],
		width: a_width, height: a_height,
		image: Game.Sprites.character,
		animation: 'idle',
		animations: animations,
		frameRate: 7,
		index: 0,
		multitouch: true,
		id: "character"
	});



	var controller = new GameController({
		id: "controller_1",
		position: [32, 32],
		layer: this.layers.hud
	});

	this.layers.hud.add(blob);
	this.layers.hud.add(simpleText);

			//blob.setAnimation("walk"); 
			//blob.start();
});


var GameController = function(config){
  var id = config.id || "controller";
  var direction = config.direction || DIRECTION.CENTER;

	var position = [(config.position[0] || 32), (config.position[1] || 32)];
	var containerSize = config.containerSize || 128;
	var centerSize = config.centerSize || 64;
	
	var containerImage = config.containerImage || Game.Sprites.dPadContainer;
	var centerImage = config.centerImage || Game.Sprites.dPadCenter;

	var layer = config.layer || null;

	var container = new Kinetic.Image({
		x: position[0], 
		y: position[1],
		width: containerSize, 
		height: containerSize,
		image: containerImage,
		name: "container"
	});

  var center = new Kinetic.Image({
		x: container.getX() + centerSize,
		y: container.getY() + centerSize,
		offset: [centerSize/2, centerSize/2],
		width: centerSize, 
		height: centerSize,
		image: centerImage,
		name: "center",
		multitouch: {draggable: true},
		dragBoundFunc: function(pos) {
			var x = container.getX() + centerSize;
			var y = container.getY() + centerSize;
			var radius = centerSize/2 + centerSize/6;
			var scale = radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
			if(scale < 1)
				return { y: Math.round((pos.y - y) * scale + y), x: Math.round((pos.x - x) * scale + x) };
			else
				return pos;
		}
	}).on(Kinetic.MultiTouch.TAP, function(){
		use_delta = !use_delta;
	}).on(Kinetic.MultiTouch.TOUCHSTART, function(){
		move_char_t = true;
	}).on(Kinetic.MultiTouch.TOUCHEND, function(){
		move_char_t = false;
	}).on(Kinetic.MultiTouch.DRAGEND, function(){
		this.setX(container.getX() + centerSize); 
		this.setY(container.getY() + centerSize); 
		this.getLayer().draw();
		move_char_t = false;
	}).on(Kinetic.MultiTouch.DRAGMOVE, function(e){
		var c = Game.Stage.get("#character")[0];
		var p = {x: this.getX(), y: this.getY()};

		var dir = getCenterDirection(p);

		if(dir == DIRECTION.NORTHWEST) {
			c.setRotationDeg(315);
		}else if(dir == DIRECTION.NORTH) {
			c.setRotationDeg(0);
		}else if(dir == DIRECTION.NORTHEAST) {
			c.setRotationDeg(45);
		}else if(dir == DIRECTION.EAST) {
			c.setRotationDeg(90);
		}else if(dir == DIRECTION.SOUTHEAST) {
			c.setRotationDeg(135);
		}else if(dir == DIRECTION.SOUTH) {
			c.setRotationDeg(180);
		}else if(dir == DIRECTION.SOUTHWEST) {
			c.setRotationDeg(225);
		}else if(dir == DIRECTION.WEST) {
			c.setRotationDeg(270);
		}
	});

	layer.add(container);
	layer.add(center);

	var getCenterDirection =function(p){
			var box = {x: container.getX(), y: container.getY(), w: 0, h: 0 };
			var box3rd = container.getWidth()/3;

			box.w = box3rd; box.h = box3rd;
			if(Util.pointInBox(p, box)){return DIRECTION.NORTHWEST; }
			box.w += box3rd;
			if(Util.pointInBox(p, box)){return DIRECTION.NORTH; }
			box.w += box3rd;
			if(Util.pointInBox(p, box)){return DIRECTION.NORTHEAST; }
			box.w = box3rd; box.h += box3rd;
			if(Util.pointInBox(p, box)){return DIRECTION.WEST; }
			box.w += box3rd;
			if(Util.pointInBox(p, box)){return DIRECTION.CENTER; }
			box.w += box3rd;
			if(Util.pointInBox(p, box)){return DIRECTION.EAST; }
			box.w = box3rd; box.h += box3rd;
			if(Util.pointInBox(p, box)){return DIRECTION.SOUTHWEST; }
			box.w += box3rd;
			if(Util.pointInBox(p, box)){return DIRECTION.SOUTH; }
			box.w += box3rd;
			if(Util.pointInBox(p, box)){return DIRECTION.SOUTHEAST; }
	}
};


/* Change the value to int later */
var DIRECTION = {
  CENTER: "CENTER",
  NORTH: "NORTH",
  NORTHEAST: "NORTH EAST",
  EAST: "EAST",
  SOUTHEAST: "SOUTH EAST",
  SOUTH: "SOUTH",
  SOUTHWEST: "SOUTH WEST",
  WEST: "WEST",
  NORTHWEST:"NORTH WEST" 
};
