var Rectangle = function(x, y, w, h){
	return {x: x, y: y, w: w, h:h};
};
var Projectile = function(config){
	this.entityType = "Projectile";
	var id = config.id;
	var tag = config.tag;
	var layer = config.layer;
	var rotationDeg = config.rotationDeg;
	var mage = Game.Entities[config.mageIdentifier];
	var radius = config.radius;
	var position = (mage.Sprite).getPosition();
	var startPosition = position;

	var range = config.range || 300;
	var moveSpeed = config.speed || 256;

	var identifier = 0;
	this.setIndentifier = function(i){
		identifier = i;
	}
	this.getIdentifier = function(){
		return identifier;
	}

	this.update = function(){
		moveProjectile();
	};

	this.getBounds = function(){
		return (new Rectangle(projectile.getX(), projectile.getY(), radius*2, radius*2));
	};

	var getSpawnPosition = function(){
		pos = [];
		pos[0] = position.x; 
		pos[1] = position.y;
		var rot = mage.Sprite.getRotationDeg();
		var w = mage.Sprite.getWidth()/2;
		var h = mage.Sprite.getHeight()/2;
		var r = (Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)))/2;
		switch(rot){
			case 315: pos[0] -= (r); pos[1] -= (r); break;
			case 0: pos[1] -= (h); break;
			case 45: pos[0] += (r); pos[1] -= (r); break;
			case 270: pos[0] -= (w);  break;
			case 90: pos[0] += (w);  break;
			case 225: pos[0] -= (r); pos[1] += (r); break;
			case 135: pos[0] += (r); pos[1] += (r); break;
			case 180: pos[1] += (h); break;
		}
		return pos;
	}

	var projectile = new Kinetic.Circle({
		position: getSpawnPosition(),
		radius: radius,
		rotationDeg: mage.Sprite.getRotationDeg(),
		fill: config.fill || "black",
		listening: false,
		id: id, 
		name: tag,
	});

	layer.add(projectile);
	
	var checkCollision = function(){
		var entity;
		var pBounds = new Rectangle(projectile.getX(), projectile.getY(), radius*2, radius*2);
		for(var i in Game.Entities){
			entity = Game.Entities[i];
			if(entity.entityType == "Mage"){
				if(entity.getIdentifier() != mage.getIdentifier() && Util.collide(pBounds, entity.getBounds())){
					destroyProjectile();
					if(entity.getCurHP() > 0){
						entity.setCurHP(entity.getCurHP() - mage.damage);
					}
					
					if(entity.getCurHP() <= 0){
						alert("Game Over! " + mage.getPlayerName() + " has won! Please restart the Game");
						Game.pause();
					}
				}
			}
		}
	}

	var moveProjectile = function(){
		var deg = projectile.getRotation();
		var delta = Game.delta;
		var vx = projectile.getX() + (delta * moveSpeed * Math.sin(deg));
		var vy = projectile.getY() - (delta * moveSpeed * Math.cos(deg));

		var dx = Math.abs(vx - startPosition.x);
		var dy = Math.abs(vy - startPosition.y);
		var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
		if(distance < range){
			checkCollision();
			projectile.setPosition([vx, vy]);
		}else{
			destroyProjectile();
		}
	};
	var destroyProjectile = function(){
		projectile.destroy();
		delete Game.Entities[identifier];
	}
}


/* MAGE CLASS*/
var Mage = function(config){
	this.entityType = "Mage";
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

	this.getPlayerName = function(){ return player; }

	var attackCD = 500; //TEMP
	var attackTimeStamp = -1; //TEMP

	/* Mage stats */ //TEMP
	this.damage = 2;
	var maxHP = 10;
	var curHP = maxHP;
	this.setCurHP = function(hp){return curHP = hp;};
	this.getCurHP = function(){return curHP;};

	var identifier = 0;
	this.setIndentifier = function(i){ identifier = i; }
	this.getIdentifier = function(){ return identifier; }

	this.getBounds = function(){
		return (new Rectangle(sprite.getX() - sprite.getOffsetX(), sprite.getY() - sprite.getOffsetY(), config.width, config.height));
	}

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
		y: sprite.getY() + (sprite.getHeight()/2) + 2,
		text: player,
		fill: color 
	});

	//TEMP
	var hpBar = new Kinetic.Rect({
		x: sprite.getX() - sprite.getOffsetX()/2,
		y: sprite.getY() + sprite.getHeight()/2,
		width: sprite.getWidth()/2,
		height: 2,
		fill: "red"
	});

	layer.add(sprite);
	layer.add(playerName);
	layer.add(hpBar);

	this.Sprite = sprite;

	this.update = function(){
		if(gameController){
			rotateSprite();
			processAction(); 
			moveMage();	
			updateHPBar();

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
			if(attackTimeStamp == -1 || ( (Game.time * 1000) - attackTimeStamp > attackCD) ){
				var bullet = new Projectile({
					radius: 8,
					fill: color,
					layer: layer,
					mageIdentifier: identifier,
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
		var y = sprite.getY() + (sprite.getHeight()/2) + 2;
		playerName.setPosition([x, y]);	
	}
	var updateHPBar = function(){
		var x = sprite.getX() - sprite.getOffsetX()/2;
		var y = sprite.getY() + sprite.getHeight()/2;
		hpBar.setWidth((curHP/maxHP) * (sprite.getWidth()/2));
		hpBar.setPosition([x, y]);	
	};
};
