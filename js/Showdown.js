window.onload = function(){
	console.log("on load...");
	Game.Sources = {
		GameAssets: "img/GameAssets.png",
		test: "img/test-asset.png",
		triangle: "img/triangle.png",
		dPadContainer: "img/d-pad-container.png",
		dPadCenter: "img/d-pad-center.png",
	};
	//Game.States = States;
	Game.initEvents(function(){
		var last_update = 0;
		document.addEventListener('mousedown', mdown, false);
		document.addEventListener('keydown', function(e){
			var b = Game.Stage.get("#blob")[0];
			//console.log(e.which);
			if(b){
				var velocity = 300;
				var dist = velocity * Game.delta;
				if(e.which == 68){
					b.setRotationDeg(b.getRotationDeg() + 10);
				}else if(e.which == 65){
					b.setRotationDeg(b.getRotationDeg() - 10);
				}

				var dx = ( dist * Math.sin(b.getRotationDeg() * (Math.PI / 180))  );
				var dy = ( dist * Math.cos(b.getRotationDeg() * (Math.PI / 180)) );
				if(e.which == 87){
					b.move(dx, -dy);
				}else if(e.which == 83){
					b.move(dx, dy);
				}


				//b.setX(dx);
				//b.setY(dy);
				if(b.getY() > Game.screenHeight()-b.getHeight()){
					b.setY(0);
				}
				if(Game.time - last_update > 0.15){
					//if(b.getAnimations().walk.length > 1){
						//b.setIndex((b.getIndex() + 1) % b.getAnimations().walk.length);	
					//}
					last_update = Game.time;
				}

			}
		}, false);

	});

	Game.core.update = function(){
		var t = (Game.time).toFixed(0);
		var s = Game.Stage.get("#text")[0];
		if(s){
			s.setText("Time: " + t);
			s.parent.draw();
		}
	}
	Game.start({container :"container"});

}

function mdown(event){
	console.log(event.x + ":" + event.y);
}

window.onresize = function(){
	Game.setScreen();
}


function resourcesLoaded() {
	StageHandler.initStage();
	StateHandler.initStates();
	DeviceHandler.setScreen();
	StateHandler.setState(StateHandler.States.MENU.NAME, 0);
}
