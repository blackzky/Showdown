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
var setScreen = function(){
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
function setState(state){
	for(i in STATES){
		CURRENT_STATE = state;
		if(STATES[i].NAME == CURRENT_STATE){
			STATES[i].LAYER.show();
		}else{
			STATES[i].LAYER.hide();
		}
		STATES[i].LAYER.draw();
	}
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
		NAME : "menu",
		LAYER : new Kinetic.Layer(),
		INIT : function(){
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
			this.LAYER.add(playButton);
		}
	};

	STATES.INGAME = {
		NAME : "ingame",	
		LAYER : new Kinetic.Layer(),
		INIT : function(){
			circle = new Kinetic.Circle({
				x: (stage.getWidth() / 2),
				y: (stage.getHeight() / 2),
				radius: 70,
				fill: 'red',
				stroke: 'black',
				strokeWidth: 4
			}).on('mousedown touchstart', function(e) {
				OBJ = this;
				writeMessage(messageLayer, "Circle: mousedown or touchstart");
				console.log("goto menu");
				setState(STATES.MENU.NAME);
			}).on('mouseup touchend', function(e) {
				writeMessage(messageLayer, "Circle: moveout and touchend");
			});
			this.LAYER.add(circle);
		}
	};
	

	messageLayer = new Kinetic.Layer();
	for(i in STATES){
		STATES[i].INIT();
		stage.add(STATES[i].LAYER);
	}
	stage.add(messageLayer);

	document.addEventListener('mousedown', inputDown, false);
	document.addEventListener('touchstart', inputDown, false);

	setScreen();
}

var clear;
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

