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

var GameController = function(config){
  var id = config.id || "controller";
	var position = [(config.position[0] || 32), (config.position[1] || 32)];
	var containerSize = config.containerSize || 128;
	var centerSize = config.centerSize || 64;
	var containerImage = config.containerImage || Game.Sprites.dPadContainer;
	var centerImage = config.centerImage || Game.Sprites.dPadCenter;
	var layer = config.layer || null;
	var opacityContainer = config.opacityContainer || 0.3;
	var opacityCenter = config.opacityCenter || 1;
  var direction = config.direction || DIRECTION.CENTER;
  var used = false;

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

	layer.add(container);
	layer.add(center);

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
