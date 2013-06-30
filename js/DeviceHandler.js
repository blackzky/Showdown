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
		var cursor = {
			x: event.x,
			y: event.y
		};
		var layer = new Kinetic.Layer({id: "start_cursor"});

      var circle = new Kinetic.Circle({
        x: cursor.x,
        y: cursor.y,
        radius: 5,
        fill: 'black'
      });
      
      var circle2 = new Kinetic.Circle({
        x: cursor.x,
        y: cursor.y,
        radius: 16,
        stroke: 'black',
        strokeWidth: 2
      });

      // add the shape to the layer
      layer.add(circle);
      layer.add(circle2);

      // add the layer to the stage
      StageHandler.stage.add(layer);


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
	},
	inputUp : function(event){
		event.preventDefault();
		StageHandler.stage.get("#start_cursor").destroy();
		StageHandler.stage.get("#end_cursor").destroy();
	},
	inputMove: function(event){
		event.preventDefault();
		if(event.which){
			var cursor = {
				x: event.x,
				y: event.y
			};
			var layer = StageHandler.stage.get("#end_cursor")[0];
			if(isDefined(layer)){
				var children = StageHandler.stage.get("#end_cursor")[0].children;
				if(isDefined(children[0])){
					for(var i in children){
						console.log();
						if(isDefined(children[i]) && isDefined(children[i].nodeType)){
							if(children[i].className == "Line"){
								children[i].destroy();
							}else{
								children[i].setX(cursor.x);
								children[i].setY(cursor.y);
							}
						}
					}
					var s_children = StageHandler.stage.get("#start_cursor")[0].children;
					var line = new Kinetic.Line({
						points: [s_children[0].getX(), s_children[0].getY(), cursor.x, cursor.y],
						stroke: 'black',
						strokeWidth: 2,
					});
					layer.add(line);
					layer.draw();
				}
			}else{
				layer = new Kinetic.Layer({id: "end_cursor"});
				var inner_circle = new Kinetic.Circle({
				  x: cursor.x,
				  y: cursor.y,
				  radius: 5,
					id: "inner_circle",
				  fill: 'black'
				});
				
				var outer_circle = new Kinetic.Circle({
				  x: cursor.x,
				  y: cursor.y,
				  radius: 32,
				  stroke: 'black',
				  id: "outer_circle",
				  strokeWidth: 4
				});

				// add the shape to the layer
				layer.add(inner_circle);
				layer.add(outer_circle);

				// add the layer to the stage
				StageHandler.stage.add(layer);
			}
		}

	}

};
