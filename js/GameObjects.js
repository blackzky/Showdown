
var Character = function(config){
	var id = config.id || "character";
	var position = [(config.position[0] || 0), (config.position[1]) || 0];
	var width = config.width || 0;
	var height = config.height || 0;
	var offset = [config.offset[0] || 0, config.offset[1] || 0];
	var image = config.image || Game.Sprites.character; 
	var animation = config.animation || "idle";
	var animations = config.animations || null;
	var frameRate = config.frameRate || 7;
	var animationIndex = config.animationIndex || 0;
	var layer = config.layer || null; 
	var gameController = config.gameController || null;

	var sprite = new Kinetic.Sprite({
		x: position[0], y: position[1],
		offset: offset,
		width: width, height: height,
		image: image,
		animation: animation,
		animations: animations,
		frameRate: frameRate,
		index: animationIndex,
		multitouch: true,
		listening: false,
		id: id, 
	});

	layer.add(sprite);

	this.Sprite = sprite;

	var direction = DIRECTION.CENTER;

	this.update = function(){
		if(gameController){
			direction = gameController.getDirection();

			switch(direction){
				case DIRECTION.NORTHWEST:
					sprite.setRotationDeg(315);
					break;
				case DIRECTION.NORTH:
					sprite.setRotationDeg(0);
					break;
				case DIRECTION.NORTHEAST:
					sprite.setRotationDeg(45);
				case DIRECTION.EAST:
					sprite.setRotationDeg(90);
					break;
				case DIRECTION.SOUTHEAST:
					sprite.setRotationDeg(135);
					break;
				case DIRECTION.SOUTH:
					sprite.setRotationDeg(180);
					break;
				case DIRECTION.SOUTHWEST:
					sprite.setRotationDeg(225);
					break;
				case DIRECTION.WEST:
					sprite.setRotationDeg(270);
					break;
				default:
					sprite.setRotationDeg(0);
					break;
			}

			if(gameController.isUsed()){
				character = sprite;
				var deg = character.getRotation();

				var speed = 96;
				var delta = Game.delta;
				var vx = character.getX() + (delta * speed * Math.sin(deg));
				var vy = character.getY() - (delta * speed * Math.cos(deg));
				if(vx < 0){ vx = Game.screenWidth(); }else if(vx > Game.screenWidth()){ vx = 0;	}
				if(vy < 0){ vy = Game.screenHeight(); }else if(vy > Game.screenHeight()){ vy = 0;	}

				character.setPosition([vx, vy]);
				character.getLayer().draw();
			}

		}

	};
};
