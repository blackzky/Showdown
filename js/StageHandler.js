var StageHandler = {
	initStage : function(){
		this.stage = new Kinetic.Stage({
			container: 'container',
			width: DeviceHandler.width(),
			height: DeviceHandler.height()
		});

		document.addEventListener('mousedown', DeviceHandler.inputDown, false);
		document.addEventListener('touchstart', DeviceHandler.inputDown, false);
	},
	stage : null
}
