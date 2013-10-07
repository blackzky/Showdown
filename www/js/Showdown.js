var move_char_t = false;
var use_delta = true;
window.onload = function(){
	app.initialize();

	Game.addSource("dPadContainer", "img/d-pad-container.png"); //combine the to image to a single image <Controller>
	Game.addSource("dPadCenter", "img/d-pad-center.png");
	Game.addSource("character", "img/character.png");
	Game.addSource("box", "img/box.png");
	Game.addSource("circle", "img/circle.png");
	Game.addSource("x", "img/x.png");
	Game.addSource("triangle", "img/triangle.png");

	Game.addState("Menu", menu);

	Game.setUpdate(function(){

	});

	Game.start({container :"container"});
}


window.onresize = function(){
	Game.setScreen();
}
