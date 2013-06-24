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
				var polySize = 32;
				
				var polygonContainer = new Kinetic.RegularPolygon({
					x: 0,
					y: 0,
					sides: 8,
					radius: polySize,
					fill: 'red',
					stroke: 'black',
					strokeWidth: 0,
					rotationDeg: 22.5,
					name: "polygonContainer"
				}).on("mousedown", function(event){
					this.setStroke("yellow");
					this.draw();
				}).on("mouseup", function(event){
					this.setStroke("black");
					this.draw();
				});

				var p1s = [];
				var p1sBaseX = polySize;
				for(var i = 0; i < 6; i++){
					var p1sX = (i > 2) ? StageHandler.stage.getWidth() - polySize : polySize;
					var m = (i > 2) ? i - 3 : i;
					var p1sY = p1sBaseX + (polySize*2*m);
					p1s[i] = polygonContainer.clone();
					p1s[i].setX(p1sX);
					p1s[i].setY(p1sY);
					p1s[i].setId("polyCon" + (i+1));
					this.layers.field.add(p1s[i]);
				}

				var p2s = [];
				var p2sBaseX = StageHandler.stage.getHeight() - (polySize * 5);
				for(var i = 0; i < 6; i++){
					var p2sX = (i > 2) ? StageHandler.stage.getWidth() - polySize : polySize;
					var m = (i > 2) ? i - 3 : i;
					var p2sY = p2sBaseX + (polySize*2*m);
					p2s[i] = polygonContainer.clone();
					p2s[i].setFill("blue");
					p2s[i].setX(p2sX);
					p2s[i].setY(p2sY);
					p2s[i].setId("polyCon" + (i+1));
					this.layers.field.add(p2s[i]);
				}

				var p1Sup = new Kinetic.Rect({
					x: 0,
					y: 0,
					width: 70,
					height: 70,
					fill: 'green',
					stroke: 'black',
					strokeWidth: 0
				});
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
