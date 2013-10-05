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


var BUTTON = {
	BOX: "BOX",
	CIRCLE: "CIRCLE",
	TRIANGLE: "TRIANGLE",
	X: "X"
};

var GameController = function(config){
  var id = config.id || "controller";
	var position = [config.position[0], config.position[1]];
	var containerSize = config.containerSize || 128;
	var centerSize = config.centerSize || 64;
	var containerImage = config.containerImage || Game.Sprites.dPadContainer;
	var centerImage = config.centerImage || Game.Sprites.dPadCenter;
	var layer = config.layer || null;
	var opacityContainer = config.opacityContainer || 0.3;
	var opacityCenter = config.opacityCenter || 1;
  var direction = config.direction || DIRECTION.CENTER;
  var used = false;

  /* Action Buttons */
  var btnPosition = config.btnPosition;
  var boxImage = config.boxImage || Game.Sprites.box; 
  var circleImage = config.circleImage || Game.Sprites.circle; 
  var xImage = config.xImage || Game.Sprites.x; 
  var triangleImage = config.triangleImage || Game.Sprites.triangle; 
  var buttonSize = config.buttonSize || 64;
  var opacityBtns = config.opacityBtns || 1;
  var btnRotation = config.btnRotation || 0;

  var boxTapped = false, circleTapped = false, xTapped = false, triangleTapped = false;

	var container = new Kinetic.Image({
		x: position[0], 
		y: position[1],
		width: containerSize, 
		height: containerSize,
		image: containerImage,
		opacity: opacityContainer,
		name: "container"
	});

  var center = new Kinetic.Image({
		x: container.getX() + centerSize,
		y: container.getY() + centerSize,
		offset: [centerSize/2, centerSize/2],
		width: centerSize, 
		height: centerSize,
		image: centerImage,
		opacity: opacityCenter,
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
	}).on(Kinetic.MultiTouch.TOUCHSTART, function(){
		used = true;
	}).on(Kinetic.MultiTouch.TOUCHEND, function(){
		used = false;
	}).on(Kinetic.MultiTouch.DRAGEND, function(){
		this.setX(container.getX() + centerSize); 
		this.setY(container.getY() + centerSize); 
		this.getLayer().draw();
		used = false;
	}).on(Kinetic.MultiTouch.DRAGMOVE, function(e){
		var p = {x: this.getX(), y: this.getY()};
		direction = getCenterDirection(p);
	});

	var boxBtn = new Kinetic.Image({
		//x: 0 + buttonSize/2 - 8, //y: 0 + buttonSize/2 - 8, //offset: [buttonSize/2, buttonSize/2], //rotationDeg: 45
		position: [0, 0],
		width: buttonSize, 
		height: buttonSize,
		image: boxImage,
		opacity: opacityBtns,
		name: "box-button",
	}).on(Kinetic.MultiTouch.TOUCHSTART, function(){
		boxTapped = true;
	}).on(Kinetic.MultiTouch.TOUCHEND, function(){
		boxTapped = false;
	});

	var xBtn = new Kinetic.Image({
		//x: 64 + buttonSize/2 + 8, //y: 64 + buttonSize/2 + 8, //offset: [buttonSize/2, buttonSize/2], //rotationDeg: 45
		position: [64, 64],
		width: buttonSize, 
		height: buttonSize,
		image: xImage,
		opacity: opacityBtns,
		name: "x-button",
	}).on(Kinetic.MultiTouch.TOUCHSTART, function(){
		xTapped = true;
	}).on(Kinetic.MultiTouch.TOUCHEND, function(){
		xTapped = false;
	});

	var circleBtn = new Kinetic.Image({
		//x: 0 - 8, //y: 64 + 8,
		position: [0, 64],
		width: buttonSize, 
		height: buttonSize,
		image: circleImage,
		opacity: opacityBtns,
		name: "circle-button",
	}).on(Kinetic.MultiTouch.TOUCHSTART, function(){
		circleTapped = true;
	}).on(Kinetic.MultiTouch.TOUCHEND, function(){
		circleTapped = false;
	});

	var triangleBtn = new Kinetic.Image({
		//x: 64 + buttonSize/2 + 16, //y: 0 + buttonSize/2 - 16, //offset: [buttonSize/2, buttonSize/2], //rotationDeg: 45
		position: [64, 0],
		width: buttonSize, 
		height: buttonSize,
		image: triangleImage,
		opacity: opacityBtns,
		name: "triangle-button",
	}).on(Kinetic.MultiTouch.TOUCHSTART, function(){
		triangleTapped = true;
	}).on(Kinetic.MultiTouch.TOUCHEND, function(){
		triangleTapped = false;
	});

	this.buttonTapped = function(btn){
		switch(btn){
			case BUTTON.BOX:
				return boxTapped;
			case BUTTON.CIRCLE:
				return circleTapped;
			case BUTTON.TRIANGLE:
				return triangleTapped;
			case BUTTON.X:
				return xTapped;
			default:
				return false;
		}
	}

	var actionBtns = new Kinetic.Group({
		position: btnPosition,
		offset: [buttonSize, buttonSize],
		listening: true,
		multitouch: true,
		rotationDeg: btnRotation 
	});

	layer.add(container);
	layer.add(center);

	actionBtns.add(boxBtn);
	actionBtns.add(xBtn);
	actionBtns.add(circleBtn);
	actionBtns.add(triangleBtn);

	layer.add(actionBtns);

	container.setZIndex(100);
	center.setZIndex(101);

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

	this.getDirection = function(){ return direction; };
	this.isUsed = function(){ return used; };
};
