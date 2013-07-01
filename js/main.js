function isDefined(object){
	return (typeof(object) != "undefined") && object != null;
}

window.onload = function(){
	StageHandler.initStage();
	StateHandler.initStates();
	DeviceHandler.setScreen();
	StateHandler.setState(StateHandler.States.MENU.NAME, 0);
	APP.play();
}

window.onresize = function(){
	DeviceHandler.setScreen();
}

