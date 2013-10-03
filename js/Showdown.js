var move_char_t = false;
var use_delta = true;
window.onload = function(){
	Game.addSource("dPadContainer", "img/d-pad-container.png"); //combine the to image to a single image <Controller>
	Game.addSource("dPadCenter", "img/d-pad-center.png");
	Game.addSource("character", "img/character.png");

	Game.addState("Menu", menu);

	handleEvents();

	var character;
	Game.setUpdate(function(){
			if(move_char_t){
				character = character || Game.Stage.get("#character")[0];
				var deg = character.getRotation();

				var speed = use_delta ? 96 : 2;
				var delta = use_delta ? Game.delta : 1;
				var vx = character.getX() + (delta * speed * Math.sin(deg));
				var vy = character.getY() - (delta * speed * Math.cos(deg));
				if(vx < 0){
					vx = Game.screenWidth();
				}else if(vx > Game.screenWidth()){
					vx = 0;	
				}
				if(vy < 0){
					vy = Game.screenHeight();
				}else if(vy > Game.screenHeight()){
					vy = 0;	
				}

				character.setPosition([vx, vy]);
				character.getLayer().draw();
			}
	});

	Game.start({container :"container"});
}

/* Code to handle events like mouse, touch and keyboard*/
function handleEvents(){


}



window.onresize = function(){
	Game.setScreen();
}
