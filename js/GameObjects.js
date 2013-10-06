var Rectangle = function(x, y, w, h){
	return {x: x, y: y, w: w, h:h};
};
var Projectile = function(config){
	var id = config.id;
	var tag = config.tag;
	var layer = config.layer;
	var rotationDeg = config.rotationDeg;
	var mage = config.mage;
	var position = mage.getPosition();
	var startPosition = position;

	var index = 0;
	var range = config.range || 300;
	var moveSpeed = config.speed || 256;

	var projectile = new Kinetic.Circle({
		position: position,
		radius: config.radius,
		rotationDeg: mage.getRotationDeg(),
		fill: config.fill || "black",
		listening: false,
		id: id, 
		name: tag,
	});

	layer.add(projectile);

	var startTime = 0;//TEMP
	this.update = function(){
		//if(startTime == 0) startTime = Game.time;
		//if(Game.time - startTime > 3 && config.remove){ //TEMP
			//Game.Entities.splice(index, 1);
			//projectile.destroy();	
			//Game.Stage.draw();
		//}
		var deg = projectile.getRotation();
		var delta = Game.delta;
		var vx = projectile.getX() + (delta * moveSpeed * Math.sin(deg));
		var vy = projectile.getY() - (delta * moveSpeed * Math.cos(deg));

		var dx = Math.abs(vx - startPosition.x);
		var dy = Math.abs(vy - startPosition.y);
		var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
		if(distance < range){
			projectile.setPosition([vx, vy]);
		}else{
			//destroy	
		}

	}
}

var Mage = function(config){
	var id = config.id || "character";
	var position = [(config.position[0] || 0), (config.position[1]) || 0];
	var image = config.image || game.sprites.character; 
	var animation = config.animation || "idle";
	var animations = config.animations || null;
	var frameRate = config.frameRate || 7;
	var animationIndex = config.animationIndex || 0;
	var layer = config.layer || null; 
	var gameController = config.gameController || null;

	var player = config.player || "player";
	var color = config.color || "black";
	var rotationDeg = config.rotationDeg || 0;
	var direction = config.direction || DIRECTION.CENTER;

	var moveSpeed = 96;
	var spriteRotation = config.rotationDeg;

	var attackCD = 1000; //TEMP
	var attackTimeStamp = 0; //TEMP

	var sprite = new Kinetic.Sprite({
		x: position[0], y: position[1],
		offset: [config.offset[0], config.offset[1]],
		width: config.width, height: config.height,
		image: image,
		animation: animation,
		animations: animations,
		frameRate: frameRate,
		index: animationIndex,
		multitouch: true,
		listening: false,
		id: id, 
		rotationDeg: rotationDeg
	});
	var playerName = new Kinetic.Text({
		x: sprite.getX() - (player.length*7.5/2),
		y: sprite.getY() + (sprite.getHeight()/2),
		text: player,
		fill: color 
	});

	layer.add(sprite);
	layer.add(playerName);

	this.Sprite = sprite;

	this.update = function(){
		if(gameController){
			rotateSprite();
			processAction(); 
			moveMage();	

			layer.draw();
		}
	};
	var moveMage = function(){
		if(gameController.isUsed()){
			var deg = sprite.getRotation();
			var delta = Game.delta;
			var vx = sprite.getX() + (delta * moveSpeed * Math.sin(deg));
			var vy = sprite.getY() - (delta * moveSpeed * Math.cos(deg));

			if(vx < 0){ vx = Game.screenWidth(); }else if(vx > Game.screenWidth()){ vx = 0;	}
			if(vy < 0){ vy = Game.screenHeight(); }else if(vy > Game.screenHeight()){ vy = 0;	}

			sprite.setPosition([vx, vy]);
			resetNamePosition();
		}
	};
	var processAction = function(){
		var b = gameController.buttonTapped(BUTTON.BOX);
		var t = gameController.buttonTapped(BUTTON.TRIANGLE);
		var x = gameController.buttonTapped(BUTTON.X);
		var c = gameController.buttonTapped(BUTTON.CIRCLE);

		if(b) { }
		if(x) { }
		if(c) { 
			if(attackTimeStamp == 0){ attackTimeStamp = Game.time * 1000; }
			if((Game.time * 1000) - attackTimeStamp > attackCD){
				var bullet = new Projectile({
					radius: 8,
					fill: color,
					layer: layer,
					mage: sprite,
				});
				Game.addEntity(bullet);
				attackTimeStamp = 0;
			}
		}

		if(t) { moveSpeed = 768; }else{ moveSpeed = 96; }
	}
	var rotateSprite = function(){
		direction = gameController.getDirection();
		switch(direction){
			case DIRECTION.NORTHWEST: spriteRotation = 315; break;
			case DIRECTION.NORTH: spriteRotation = 0; break;
			case DIRECTION.NORTHEAST: spriteRotation = 45; break;
			case DIRECTION.EAST: spriteRotation = 90; break;
			case DIRECTION.SOUTHEAST: spriteRotation = 135; break;
			case DIRECTION.SOUTH: spriteRotation = 180; break;
			case DIRECTION.SOUTHWEST: spriteRotation = 225; break;
			case DIRECTION.WEST: spriteRotation = 270; break;
		}
		sprite.setRotationDeg(spriteRotation);
	};
	var resetNamePosition = function(){
		var x = sprite.getX() - (player.length*7.5/2);
		var y = sprite.getY() + (sprite.getHeight()/2);
		playerName.setPosition([x, y]);	
	}
};
