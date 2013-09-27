window.Game = window.Game || {};

Game.Sources = {};
Game.Sprites = {};
Game.States = {};
Game.update = function(){};
Game.Stage = null;

Game.addState = function(state_name, state){
	if(!Game.States[state_name]){
		Game.States[state_name] = state;
	}
}

Game.addSource = function(source_name, source){
	if(!Game.Sources[source_name]){
		Game.Sources[source_name] = source;
	}	
}

Game.setUpdate = function(update){
	Game.update = update;
}


Game.start = function(params){
	Game.Stage = new Kinetic.Stage({
		container: params.container,
		width: Game.screenWidth(),
		height: Game.screenHeight()
	});
	Game.setScreen();
	Game.loadImages(Game.Sources, Game.init);
}
Game.initEvents = function(gameEvents){
	gameEvents();
}
Game.play = function() {
	Game.core.then = Date.now();
	Game.core.frame();
};
Game.pause = function() {
	window.cancelRequestAnimFrame(Game.core.animationFrame); 
};
Game.init = function(){
	Game.time = 0;
	for(var i in Game.States){
		Game.States[i].init();
		for(j in Game.States[i].layers){
			Game.Stage.add(Game.States[i].layers[j]);
		}
	}
	Game.play();
};

Game.loadImages = function(sources, callback) {
	var loadedImages = 0;
	var numImages = 0;
	for (var src in sources) {
		numImages++;
	}
	for (var src in sources) {
		Game.Sprites[src] = new Image();
		Game.Sprites[src].onload = function(){
			if (++loadedImages >= numImages) {
				callback();
			}
		};
		Game.Sprites[src].src = sources[src];
	}
} 

Game.core = {
	frame: function() {
		Game.core.setDelta();
		Game.core.update();
		Game.core.animationFrame = window.requestAnimFrame(Game.core.frame);
	},
 
	setDelta: function() {
		Game.core.now = Date.now();
		Game.delta = (Game.core.now - Game.core.then) / 1000; // seconds since last frame
		Game.time = Game.time + Game.delta;
		Game.core.then = Game.core.now;
	},
	update: function(){ 
		Game.update();
	}
};

Game.screenWidth = function(){
	if (window.innerWidth){
		return window.innerWidth;
	}else if (document.body && document.body.offsetWidth){
		return document.body.offsetWidth;
	}else{
		return 0;
	}
};
Game.screenHeight = function(){
	if (window.innerHeight){
		return window.innerHeight;
	}else if (document.body && document.body.offsetHeight){
		return document.body.offsetHeight;
	}else{
		return 0;
	}
};
Game.setScreen = function(){
		Game.Stage.setWidth(Game.screenWidth());
		Game.Stage.setHeight(Game.screenHeight());
		Game.Stage.setWidth(document.querySelector("body").clientWidth);
		Game.Stage.setHeight(document.querySelector("body").clientHeight);

		if(typeof(WebSettings) != 'undefined'){ WebSettings.setBuiltInZoomControls(false); }
		window.scrollTo(0, 1);
};

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     ||  
		function( callback ){
			return window.setTimeout(callback, 1000 / 60);
		};
})();
window.cancelRequestAnimFrame = (function() {
	return window.cancelAnimationFrame          ||
		window.webkitCancelRequestAnimationFrame    ||
		window.mozCancelRequestAnimationFrame       ||
		window.oCancelRequestAnimationFrame     ||
		window.msCancelRequestAnimationFrame        ||
		clearTimeout
})();
