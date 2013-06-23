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
				var circle = new Kinetic.Circle({
					x: (StageHandler.stage.getWidth() / 2),
					y: (StageHandler.stage.getHeight() / 2),
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
				this.layers.field.add(circle);
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
