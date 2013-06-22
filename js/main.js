var Device = {
	width : function(){
		if (window.innerWidth){
			return window.innerWidth;
		}else if (document.body && document.body.offsetWidth){
			return document.body.offsetWidth;
		}else{
			return 0;
		}
	},
	height : function(){
		if (window.innerHeight){
			return window.innerHeight;
		}else if (document.body && document.body.offsetHeight){
			return document.body.offsetHeight;
		}else{
			return 0;
		}
	}
};
function setScreen(){
	stage.setWidth(Device.width());
	stage.setHeight(Device.height());
	stage.setWidth(document.querySelector("body").clientWidth);
	stage.setHeight(document.querySelector("body").clientHeight - 10);

	if(typeof(WebSettings) != 'undefined'){ WebSettings.setBuiltInZoomControls(false); }
	window.scrollTo(0, 1);
}
function writeMessage(messageLayer, message) {
	var context = messageLayer.getContext();
	messageLayer.clear();
	context.font = '18pt Calibri';
	context.fillStyle = 'black';
	context.fillText(message, 10, 25);
}
function setState(state, delay){
	delay = (typeof(delay) == "undefined" ? 500 : delay);
	writeMessage(messageLayer, "Loading...");
	CURRENT_STATE = (typeof(CURRENT_STATE) == "undefined" ? STATES.MENU.NAME : CURRENT_STATE);
	for(i in STATES[CURRENT_STATE].LAYERS){
		STATES[CURRENT_STATE].LAYERS[i].clear();
	}
	var t = setTimeout(function(){
		messageLayer.clear();
		for(i in STATES){
			CURRENT_STATE = state;
			for(j in STATES[i].LAYERS){
				if(STATES[i].NAME == CURRENT_STATE){
					STATES[i].LAYERS[j].show();
				}else{
					STATES[i].LAYERS[j].hide();
				}
				STATES[i].LAYERS[j].draw();
			}
		}
	}, delay);
}

var stage;
var OBJ;
var messageLayer;
var circle;

var CURRENT_STATE;
var STATES = {};

function initStage(){
	stage = new Kinetic.Stage({
		container: 'container',
		width: Device.width(),
		height: Device.height()
	});

	STATES.MENU = {
		NAME : "MENU",
		LAYERS : {
			HUD : null
		},
		INIT : function(){
			this.LAYERS.HUD = new Kinetic.Layer();
			var playButton = new Kinetic.Label({
				x: (stage.getWidth() / 2),
				y: (stage.getHeight() / 2),
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
				console.log("goto ingame");
				setState(STATES.INGAME.NAME);
			});
			this.LAYERS.HUD.add(playButton);
		}
	};
	STATES.INGAME = {
		NAME : "INGAME",	
		LAYERS : {
			FIELD : null
		},
		INIT : function(){
			this.LAYERS.FIELD = new Kinetic.Layer();
			circle = new Kinetic.Circle({
				x: (stage.getWidth() / 2),
				y: (stage.getHeight() / 2),
				radius: 70,
				fill: 'red',
				stroke: 'black',
				strokeWidth: 4
			}).on('mousedown touchstart', function(e) {
				OBJ = this;
				setState(STATES.MENU.NAME);
			}).on('mouseup touchend', function(e) {
				writeMessage(messageLayer, "Circle: moveout and touchend");
			});
			this.LAYERS.FIELD.add(circle);
		}
	};
	
	addStateLayers();
	messageLayer = new Kinetic.Layer();
	stage.add(messageLayer);

	document.addEventListener('mousedown', inputDown, false);
	document.addEventListener('touchstart', inputDown, false);

	setScreen();
	setState(STATES.MENU.NAME, 0);
}

function addStateLayers(){
	for(i in STATES){
		STATES[i].INIT();
		for(j in STATES[i].LAYERS){
			stage.add(STATES[i].LAYERS[j]);
		}
	}
}
function inputDown(event){
	event.preventDefault();
	var object = OBJ ? OBJ : circle;

	if(typeof(event.touches) == 'undefined'){
		console.log("Document: mousedown");
		object.setX(event.x);
		object.setY(event.y);
	}else{
		console.log("Document: touchstart");
		for (var i = 0; i < event.touches.length; i++) {
			var touch = event.touches[i];
			object.setX(touch.pageX);
			object.setY(touch.pageY);
		}
	}
	stage.draw();
}

window.onload = function(){
	initStage();
}

window.onresize = function(){
	setScreen();
}

