var DeviceHandler = {
	inputDown : function(event){
		event.preventDefault();
		//var object = OBJ ? OBJ : circle;
		
		if(StateHandler.currentState == StateHandler.States.INGAME.name){
			StateHandler.States.INGAME.handleInputDown({x: event.x, y: event.y});
		}

		if(typeof(event.touches) == 'undefined'){
			//object.setX(event.x);
			//object.setY(event.y);
		}else{
			for (var i = 0; i < event.touches.length; i++) {
				var touch = event.touches[i];
				//object.setX(touch.pageX);
				//object.setY(touch.pageY);
			}
		}
		//stage.draw();
	},
	inputUp : function(event){
		event.preventDefault();
		if(StateHandler.currentState == StateHandler.States.INGAME.name){
			StateHandler.States.INGAME.handleInputEnd(event.x, event.y);
		}
	},
	inputMove: function(event){
		event.preventDefault();
		if(StateHandler.currentState == StateHandler.States.INGAME.name){
			if(event.which){
				StateHandler.States.INGAME.handleInputMove({x: event.x, y: event.y});
			}
		}

	}

};
