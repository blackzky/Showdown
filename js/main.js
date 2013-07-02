function isDefined(object){
	return (typeof(object) != "undefined") && object != null;
}

var Resources = {};
window.onload = function(){
	var sources = {
		GameAssets: "img/GameAssets.png",
	};
	loadImages(sources, resourcesLoaded);  
}

window.onresize = function(){
	DeviceHandler.setScreen();
}

function loadImages(sources, callback) {
	var loadedImages = 0;
	var numImages = 0;
	for (var src in sources) {
		numImages++;
	}
	for (var src in sources) {
		Resources[src] = new Image();
		Resources[src].onload = function(){
			if (++loadedImages >= numImages) {
				callback();
			}
		};
		Resources[src].src = sources[src];
	}
} 

function resourcesLoaded() {
	StageHandler.initStage();
	StateHandler.initStates();
	DeviceHandler.setScreen();
	StateHandler.setState(StateHandler.States.MENU.NAME, 0);
	APP.play();
}
