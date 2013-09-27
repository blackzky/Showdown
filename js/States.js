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
    x: Game.screenWidth() / 2,
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
          id: "character"
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
        cont_x: 0,
        cont_y: 0,
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
  CENTER: 0,
  NORTH: 1
};

var GameController = function(id){
  this.id = id;
  this.direction = DIRECTION.CENTER;
  var CENTER_DRAGGED = false;
  var CENTER_DRAG_END = true;

  var container = null;
  var center = null;

  this.getContainer = function(){ return container};
  this.getCenter = function(){ return center};

  this.initController = function(controller){
      container = new Kinetic.Image({
          x: controller.cont_x, 
          y: controller.cont_y,
          width: controller.cont_size, 
          height: controller.cont_x,
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
          name: "center",
          draggable: true,
          dragBoundFunc: function(pos) {
            var x = container.getX() + controller.center_size;
            var y = container.getY() + controller.center_size;
            var radius = controller.center_size/2;
            var scale = radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
            if(scale < 1)
              return {
                y: Math.round((pos.y - y) * scale + y),
                x: Math.round((pos.x - x) * scale + x)
              };
            else
              return pos;
          }

      }).on("dragend", function(){
        this.setX(container.getX() + controller.center_size); 
        this.setY(container.getY() + controller.center_size); 
        this.getLayer().draw();
      }).on("dragmove", function(e){
        var c = Game.Stage.get("#character")[0];
        var p = {x: this.getX(), y: this.getY()};
        var box = {
          x: container.getX(), 
          y: container.getY(), 
          w: container.getWidth(), 
          h: container.getHeight() 
        };

        box.w = (box.w/3);
        box.h = (box.h/3);

        if(Util.pointInBox(p, box)) {
          c.setRotationDeg(315);
        }
        box.x = box.w;
        box.w = ((container.getWidth()*2)/3);
        if(Util.pointInBox(p, box)){
          c.setRotationDeg(0);
        }
        box.x = box.w;
        box.w = container.getWidth();
        if(Util.pointInBox(p, box)){
          c.setRotationDeg(45);
        }
        //console.log("move [" + this.getX() + ", " + this.getY() + "]");
      });
  }

  this.addToStage = function(layer){
    layer.add(container);
    layer.add(center);
  }

};