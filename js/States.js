var State = function(name){
	this.name = name;
	this.init = function(){};
	this.layers = {};
}

var menu = new State("Menu");
menu.init = function(){
			this.layers.hud = new Kinetic.Layer();
			var l = new Kinetic.Rect({
				x: 10, y: 10,
				width: 100, height: 100,
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
          x: 0, y: 0,
          height: a_height,
          image: Game.Sprites.test,
          animation: 'idle',
          animations: animations,
          frameRate: 1,
          index: 0,
          id: "blob"
      });
			//this.layers.hud.add(l);
			this.layers.hud.add(simpleText);
			this.layers.hud.add(blob);

			blob.setAnimation("walk"); 
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
