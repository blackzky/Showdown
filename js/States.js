var State = function(name){
	this.name = name;
	this.init = function(){};
	this.layers = {};
}

var menu = new State("Menu");
menu.init = function(){
			this.layers.hud = new Kinetic.Layer();
			var l = new Kinetic.Rect({
				x: 10, y: Game.screenHeight() - 74,
				width: 64, height: 64,
				fill: 'green', stroke: 'black',
			}).on("mousedown", function(e){
				e.cancelBubble = true;
				console.log("green: " + e.x + "," + e.y);
			});
			var simpleText = new Kinetic.Text({
				x: Game.screenWidth() / 2,
				y: 15,
				text: 'Simple Text',
				fontSize: 30,
				fontFamily: 'Calibri',
				fill: 'green',
				id: "text"
			});

			var a_width = 150,
					a_height = 117;
			var animations = {
        idle: [{
          x: 0, y: 0, width: a_width, height: a_height
        }],
        walk: [{
          x: 0, y: 0, width: a_width, height: a_height 
        }, {
          x: a_width, y: 0, width: a_width, height: a_height 
        }, {
          x: a_width * 2, y: 0, width: a_width, height: a_height 
        }, {
          x: a_width * 3, y: 0, width: a_width, height: a_height 
        }, {
          x: a_width * 4, y: 0, width: a_width, height: a_height 
        }]
      };
			var blob = new Kinetic.Sprite({
          x: Game.screenWidth()/2 + a_width/2, y: Game.screenHeight()/2 - a_height/2,
          offsetX: a_width/2, offsetY: a_height/2,
          width: a_width, height: a_height,
          image: Game.Sprites.triangle,
          animation: 'idle',
          animations: animations,
          frameRate: 1,
          index: 0,
          id: "blob"
      });

			var dPadContainer = new Kinetic.Image({
          x: 0, y: Game.screenHeight() - 128,
          width: 128, height: 128,
          image: Game.Sprites.dPadContainer,
          id: "dPadContainer"
      });
			var dPadCenter = new Kinetic.Image({
          x: dPadContainer.getX() + 64, y: dPadContainer.getY() + 64,
          offsetX: 32, offsetY: 32,
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

      }).on("dragend", function(){
     		this.setX(dPadContainer.getX() + 64); 
     		this.setY(dPadContainer.getY() + 64); 
      }).on("dragmove", function(){
      	var b = Game.Stage.get("#blob")[0];
      	if(b){
      		var dpc = {y:dPadContainer.getY()+64, x:dPadContainer.getX()+64};
      		var angle = Math.atan((this.getY() - dpc.y)/(this.getX() - dpc.x));
      		angle = ((angle * 180)/Math.PI) + ((this.getX() - dpc.x)>0 ? 90 : -90);
      		b.setRotationDeg(angle);
      	}
      });

			this.layers.hud.add(blob);
			this.layers.hud.add(simpleText);
			this.layers.hud.add(dPadContainer);
			this.layers.hud.add(dPadCenter);
			//this.layers.hud.add(l);

			//blob.setAnimation("walk"); 
			//blob.start();
}
Game.States.Menu = menu;

/********************************************************************/
/*Template*/
/*
	var States = {
		StateName: {
			init: function(){},
			layers: {
				layer1: null,
				layer2: null
			}
		}
	};

*/
/* End Template */
