var StateHandler = {
	currentState : null,
	States : {},
	messageLayer : null,
	writeMessage : function(message) {
		var context = this.messageLayer.getContext();
		this.messageLayer.clear();
		context.font = '18pt Calibri';
		context.fillStyle = 'black';
		context.fillText(message, 10, 25);
	},
	initStates : function(){
		this.States.MENU = {
			name : "MENU",
			layers : {
				hud : null
			},
			init : function(){
				this.layers.hud = new Kinetic.Layer();
				var playButton = new Kinetic.Label({
					x: (StageHandler.stage.getWidth() / 2),
					y: (StageHandler.stage.getHeight() / 2),
					opacity: 0.75
				});
				playButton.add(new Kinetic.Tag({
				  fill: 'teal',
					stroke: 'black'
				})).add(new Kinetic.Text({
				  text: 'Play',
				  fontFamily: 'Arial',
				  fontSize: 30,
				  padding: 5,
				  fill: 'black'
				})).on('mouseup touchend', function(e) {
					console.log("goto INGAME State");
					StateHandler.setState(StateHandler.States.INGAME.name);
				});
				this.layers.hud.add(playButton);
			}
		};
		this.States.INGAME = {
			name : "INGAME",	
			layers : {
				field : null
			},
			init : function(){
				this.layers.field = new Kinetic.Layer();
				var polySize = 64;
				
				var polygonContainer = new Kinetic.RegularPolygon({
					x: 0,
					y: 0,
					sides: 8,
					radius: polySize/2,
					fill: 'red',
					stroke: 'black',
					strokeWidth: 3,
					rotationDeg: 22.5,
					name: "polygonContainer"
				}).on("mousedown", function(event){
					this.setStroke("yellow");
					this.draw();
				}).on("mouseup", function(event){
					this.setStroke("black");
					this.draw();
				});

				var padding = 5;
				var p1s = [];
				var p1sBaseX = polySize/2 + padding;
				for(var i = 0; i < 6; i++){
					var p1sX = (i > 2) ? StageHandler.stage.getWidth() - (polySize/2) - padding : (polySize/2) + padding;
					var m = (i > 2) ? i - 3 : i;
					var p1sY = p1sBaseX + (polySize*m);
					p1s[i] = polygonContainer.clone();
					p1s[i].setX(p1sX);
					p1s[i].setY(p1sY);
					p1s[i].setId("polyCon" + (i+1));
					this.layers.field.add(p1s[i]);
				}

				var p2s = [];
				var p2sBaseX = StageHandler.stage.getHeight() - (polySize * 2.5) - padding;
				for(var i = 0; i < 6; i++){
					var p2sX = (i > 2) ? StageHandler.stage.getWidth() - (polySize/2) - padding : (polySize/2) + padding;
					var m = (i > 2) ? i - 3 : i;
					var p2sY = p2sBaseX + (polySize*m);
					p2s[i] = polygonContainer.clone();
					p2s[i].setFill("blue");
					p2s[i].setX(p2sX);
					p2s[i].setY(p2sY);
					p2s[i].setId("polyCon" + (i+1));
					this.layers.field.add(p2s[i]);
				}

				var lifeIco = new Kinetic.Path({
					x: p1s[0].getX() - polySize/2.9,
					y: p1s[0].getY() - polySize/4,
					data: 'M248.078,5.883c-36.691-14.739-77.771-0.839-98.517,31.125C128.817,5.044,87.735-8.856,51.043,5.883C9.354,22.632-10.863,70.009,5.887,111.696c16.06,39.98,143.314,139.607,143.314,139.607l0.359,0.28l0.36-0.28c0,0,127.251-99.627,143.314-139.607C309.986,70.009,289.768,22.632,248.078,5.883z',
					fill: 'green',
					scale: 0.15,
					stroke: 'black',
					strokeWidth: 10
				});

				this.layers.field.add(lifeIco);

				var reflectIco = new Kinetic.Rect({
				  x: p1s[1].getX() - polySize/4,
				  y: p1s[1].getY() - polySize/4,
				  width: polySize/2,
				  height: polySize/2,
				  fill: 'green',
				  stroke: 'black',
				});
				this.layers.field.add(reflectIco);

				var shieldIco = new Kinetic.RegularPolygon({
				  x: p1s[2].getX(),
				  y: p1s[2].getY(),
				  sides: 3,
				  radius: polySize/3,
				  fill: 'green',
				  stroke: 'black',
				});
				this.layers.field.add(shieldIco);

				var normalIco = new Kinetic.Circle({
				  x: p1s[3].getX(),
				  y: p1s[3].getY(),
				  radius: polySize/3,
				  fill: 'green',
				  stroke: 'black',
				});
				this.layers.field.add(normalIco);

				var fastIco = new Kinetic.RegularPolygon({
				  x: p1s[4].getX(),
				  y: p1s[4].getY(),
				  sides: 5,
				  radius: polySize/3,
				  fill: 'green',
				  stroke: 'black',
				});
				this.layers.field.add(fastIco);

				var pierceIco = new Kinetic.RegularPolygon({
				  x: p1s[5].getX(),
				  y: p1s[5].getY(),
				  sides: 8,
				  radius: polySize/3,
				  fill: 'green',
				  stroke: 'black',
				});
				this.layers.field.add(pierceIco);


				var circle = new Kinetic.Circle({
					//x: (StageHandler.stage.getWidth() / 3),
					//y: (StageHandler.stage.getHeight() / 2),
					x: 70,
					y: 70,
					radius: 70,
					fill: 'red',
					stroke: 'black',
					strokeWidth: 4
				}).on('mousedown touchstart', function(e) {
					StateHandler.writeMessage("Circle: mousedown or touchstart");
				}).on('mouseup touchend', function(e) {
					StateHandler.writeMessage("Circle: mouseup or touchsend");
					StateHandler.setState(StateHandler.States.MENU.name);
				});
				//this.layers.field.add(circle);
			}
		};

		this.addStateLayers();
		this.messageLayer = new Kinetic.Layer();
		StageHandler.stage.add(this.messageLayer);
	},
	setState : function(state, delay){
		delay = (typeof(delay) == "undefined" ? 500 : delay);
		StateHandler.writeMessage("Loading...");
		StateHandler.currentState = (isDefined(StateHandler.currentState)?state:StateHandler.States.MENU.name);
		for(i in StateHandler.States[this.currentState].layers){
			StateHandler.States[this.currentState].layers[i].clear();
		}
		var t = setTimeout(function(){
			StateHandler.writeMessage("");
			for(i in StateHandler.States){
				StateHandler.currrentState = state;
				for(j in StateHandler.States[i].layers){
					if(StateHandler.States[i].name == StateHandler.currentState){
						console.log(i + " " + j);
						StateHandler.States[i].layers[j].show();
					}else{
						StateHandler.States[i].layers[j].hide();
					}
					StateHandler.States[i].layers[j].draw();
				}
			}
		}, delay);
	}, 
	addStateLayers : function(){
		for(i in this.States){
			this.States[i].init();
			for(j in this.States[i].layers){
				StageHandler.stage.add(this.States[i].layers[j]);
			}
		}
	}
};
