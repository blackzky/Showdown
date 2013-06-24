var DeviceHandler = {
	width : function(){
		if (window.innerWidth){
			return window.innerWidth;
		}else if (document.body && document.body.offsetWidth){
			return document.body.offsetWidth;
		}else{
			return 0;
		}
	},
	height : function(){
		if (window.innerHeight){
			return window.innerHeight;
		}else if (document.body && document.body.offsetHeight){
			return document.body.offsetHeight;
		}else{
			return 0;
		}
	},
	setScreen : function(){
		StageHandler.stage.setWidth(this.width());
		StageHandler.stage.setHeight(this.height());
		StageHandler.stage.setWidth(document.querySelector("body").clientWidth);
		StageHandler.stage.setHeight(document.querySelector("body").clientHeight);

		if(typeof(WebSettings) != 'undefined'){ WebSettings.setBuiltInZoomControls(false); }
		window.scrollTo(0, 1);
	},
	inputDown : function(event){
		event.preventDefault();
		//var object = OBJ ? OBJ : circle;

		if(typeof(event.touches) == 'undefined'){
			console.log("Document: mousedown");
			//object.setX(event.x);
			//object.setY(event.y);
		}else{
			console.log("Document: touchstart");
			for (var i = 0; i < event.touches.length; i++) {
				var touch = event.touches[i];
				//object.setX(touch.pageX);
				//object.setY(touch.pageY);
			}
		}
		//stage.draw();
	}

};
