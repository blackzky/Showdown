window.onload = function(){
	Game.addSource("dPadContainer", "img/d-pad-container.png"); //combine the to image to a single image <Controller>
	Game.addSource("dPadCenter", "img/d-pad-center.png");
	Game.addSource("character", "img/character.png");

	Game.addState("Menu", menu);

	handleEvents();

	Game.setUpdate(function(){

	});

	Game.start({container :"container"});
}

/* Code to handle events like mouse, touch and keyboard*/
function handleEvents(){


}



window.onresize = function(){
	Game.setScreen();
}
