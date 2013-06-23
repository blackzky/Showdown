function isDefined(object){
	return (typeof(object) != "undefined") && object != null;
}

window.onload = function(){
	StageHandler.initStage();
	StateHandler.initStates();
	DeviceHandler.setScreen();
	//setState(STATES.MENU.NAME, 0);
}

window.onresize = function(){
	DeviceHandler.setScreen();
}

