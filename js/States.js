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
      }).on(Kinetic.MultiTouch.TOUCHSTART,function(){
     		var t = Game.Stage.get("#text")[0]; 
     		t.setText("Character touched!");
        t.getLayer().draw();
      }).on(Kinetic.MultiTouch.TOUCHEND,function(){
     		var t = Game.Stage.get("#text")[0]; 
     		t.setText("Character NOT touched!");
        t.getLayer().draw();
      });

      /*
			var dPadContainer = new Kinetic.Image({
          x: 0, y: Game.screenHeight() - 128,
          width: 128, height: 128,
          image: Game.Sprites.dPadContainer,
          id: "dPadContainer"
      });
			var dPadCenter = new Kinetic.Image({
          x: dPadContainer.getX() + 64, y: dPadContainer.getY() + 64,
          offset: [32, 32],
          width: 64, height: 64,
          image: Game.Sprites.dPadCenter,
          id: "dPadCenter",
					draggable: true,
          dragBoundFunc: function(pos) {
            var x = dPadContainer.getX() + 64;
            var y = dPadContainer.getY() + 64;
            var radius = 32;
            var scale = radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
            if(scale < 1)
              return {
                y: Math.round((pos.y - y) * scale + y),
                x: Math.round((pos.x - x) * scale + x)
              };
            else
              return pos;
          }

      }).on("touchstart", function(e){
      	e.cancelBubble = true;
      	m = true;
      }).on("dragend", function(){
     		this.setX(dPadContainer.getX() + 64); 
     		this.setY(dPadContainer.getY() + 64); 
     		m = false;
      }).on("dragmove", function(){
      	var b = Game.Stage.get("#blob")[0];
      	console.log(this.getX() + ", " + this.getY());
      	if(b){
      		var dpc = { x: dPadContainer.getX() + 64, y: dPadContainer.getY() + 64 };
      		var angle = Math.atan((this.getY() - dpc.y)/(this.getX() - dpc.x));
      		//angle = ((angle * 180)/Math.PI) + ((this.getX() - dpc.x)>0 ? 90 : -90);

					angle = (angle * 180)/Math.PI;
					if((this.getX() - dpc.x) > 0){
						angle += 90;
					}else{
						angle -= 90;
					}

      		b.setRotationDeg(angle);
      		if(m){
						var velocity = 300;
						var dist = velocity * Game.delta;
						var dx = ( dist * Math.sin(b.getRotationDeg() * (Math.PI / 180))  );
						var dy = ( dist * Math.cos(b.getRotationDeg() * (Math.PI / 180)) );
						b.move(dx, -dy);
					}
      	}
      });
      */


      var controller = new GameController("player");
      controller.initController({
        cont_x: 32,
        cont_y: 32,
        cont_size: 128,
        cont_image: Game.Sprites.dPadContainer,
        center_size: 64,
        center_image: Game.Sprites.dPadCenter
      });

      controller.addToStage(this.layers.hud);
      //this.layers.hud.add(controller.getContainer());
      //this.layers.hud.add(controller.getCenter());

			this.layers.hud.add(blob);
			this.layers.hud.add(simpleText);
			//this.layers.hud.add(dPadContainer);
			//this.layers.hud.add(dPadCenter);
			//this.layers.hud.add(l);

			//blob.setAnimation("walk"); 
			//blob.start();
});


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

var GameController = function(id){
  this.id = id;
  this.direction = DIRECTION.CENTER;

  var container = null;
  var center = null;

  this.getContainer = function(){ return container};
  this.getCenter = function(){ return center};

  this.initController = function(controller){
      container = new Kinetic.Image({
          x: controller.cont_x, 
          y: controller.cont_y,
          width: controller.cont_size, 
          height: controller.cont_size,
          image: controller.cont_image,
          name: "container"
      });

      center = new Kinetic.Image({
          x: container.getX() + controller.center_size,
          y: container.getY() + controller.center_size,
          offset: [controller.center_size/2, controller.center_size/2],
          width: controller.center_size, 
          height: controller.center_size,
          image: controller.center_image,
          id: "game-controller",
          multitouch: {draggable: true},
          dragBoundFunc: function(pos) {
            var x = container.getX() + controller.center_size;
            var y = container.getY() + controller.center_size;
            var radius = controller.center_size/2 + controller.center_size/6;
            var scale = radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
            if(scale < 1)
              return { y: Math.round((pos.y - y) * scale + y), x: Math.round((pos.x - x) * scale + x) };
            else
              return pos;
          }

      }).on(Kinetic.MultiTouch.TAP, function(){
      	use_delta = !use_delta;
      	console.log(use_delta);
      }).on(Kinetic.MultiTouch.TOUCHSTART, function(){
      	move_char_t = true;
      }).on(Kinetic.MultiTouch.DRAGEND, function(){
        this.setX(container.getX() + controller.center_size); 
        this.setY(container.getY() + controller.center_size); 
        this.getLayer().draw();
      	move_char_t = false;
      }).on(Kinetic.MultiTouch.DRAGMOVE, function(e){
        var c = Game.Stage.get("#character")[0];
        var p = {x: this.getX(), y: this.getY()};

        var dir = getDirection(p);

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

     		var t = Game.Stage.get("#text")[0]; 
     		t.setText("(Delta: " + use_delta + ") [" + c.getRotationDeg() + "] " + dir);
        t.getLayer().draw();

      });

	
		var move = function(){
        var character = Game.Stage.get("#character")[0];
        var deg = character.getRotation();

				var speed = 64;
				var delta = Game.delta;
        var vx = character.getX() + (delta * speed * Math.sin(deg));
        var vy = character.getY() - (delta * speed * Math.cos(deg));
			
				character.setPosition([vx, vy]);

		}

    var getDirection =function(p){
        var box = {x: container.getX(), y: container.getY(), w: 0, h: 0 };
        var box3rd = container.getWidth()/3;

        box.w = box3rd;
        box.h = box3rd;
        if(Util.pointInBox(p, box)){return DIRECTION.NORTHWEST; }

        box.w += box3rd;
        if(Util.pointInBox(p, box)){return DIRECTION.NORTH; }

        box.w += box3rd;
        if(Util.pointInBox(p, box)){return DIRECTION.NORTHEAST; }

        box.w = box3rd;
        box.h += box3rd;
        if(Util.pointInBox(p, box)){return DIRECTION.WEST; }

        box.w += box3rd;
        if(Util.pointInBox(p, box)){return DIRECTION.CENTER; }

        box.w += box3rd;
        if(Util.pointInBox(p, box)){return DIRECTION.EAST; }

        box.w = box3rd;
        box.h += box3rd;
        if(Util.pointInBox(p, box)){return DIRECTION.SOUTHWEST; }

        box.w += box3rd;
        if(Util.pointInBox(p, box)){return DIRECTION.SOUTH; }

        box.w += box3rd;
        if(Util.pointInBox(p, box)){return DIRECTION.SOUTHEAST; }
    }
  }

  this.addToStage = function(layer){
    layer.add(container);
    layer.add(center);
  }

};
