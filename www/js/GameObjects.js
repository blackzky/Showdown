var Rectangle = function(x, y, w, h){ return {x: x, y: y, w: w, h:h}; };

/* PROJECTILE CLASS*/
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
	this.setIndentifier = function(i){ identifier = i; }
	this.getIdentifier = function(){ return identifier; }

	this.update = function(){ moveProjectile(); };

	this.getBounds = function(){ return (new Rectangle(projectile.getX(), projectile.getY(), radius*2, radius*2)); };

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
						Game.gameOver = true;
						alert("Game Over! " + mage.getPlayerName() + " has won! Please restart the Game");
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
/* END OF PROJECTILE CLASS*/

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

	/* Mage stats */ //TEMP
	var attackCD = 500; 
	var attackTimeStamp = -1; 
	this.damage = 2;
	var attackCost = 1;
	var dashCost = 10;
	var maxHP = 10, maxMP = 10, maxEN = 10;
	var curHP = maxHP, curMP = maxMP, curEN = maxEN;
	var hpRegen = 0.1, mpRegen = 0.3, enRegen = 0.5;
	var regenTimeStamp = 0; 
	this.setCurHP = function(hp){
		return curHP = (hp < 0) ? 0 : hp;
	};
	this.getCurHP = function(){return curHP;};
	this.setCurMP = function(mp){return curMP = mp;};
	this.getCurMP = function(){return curMP;};
	this.setCurEN = function(en){return curEN = en;};
	this.getCurEN = function(){return curEN;};

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
		x: sprite.getX(),
		y: sprite.getY(),
		text: player,
		fill: color 
	});

	var hpBar = new Kinetic.Rect({
		position: [0, 0],
		width: sprite.getWidth()/2,
		height: 2,
		offset: [sprite.getWidth()/4, 1],
		fill: "red"
	});

	var mpBar = new Kinetic.Rect({
		position: [0, 0],
		width: sprite.getWidth()/2,
		height: 2,
		offset: [sprite.getWidth()/4, 1],
		fill: "blue"
	});
	var enBar = new Kinetic.Rect({
		position: [0, 0],
		width: sprite.getWidth()/2,
		height: 2,
		offset: [sprite.getWidth()/4, 1],
		fill: "yellow",
	});

	layer.add(sprite);
	layer.add(playerName);
	layer.add(hpBar);
	layer.add(mpBar);
	layer.add(enBar);

	this.Sprite = sprite;

	this.update = function(){
		if(gameController){
			rotateSprite();
			processAction(); 
			if(gameController.isUsed()){
				moveMage();	
			}
			updateBars();
			regenStats();

			layer.draw();
		}
	};
	var moveMage = function(){
		var deg = sprite.getRotation();
		var delta = Game.delta;
		var vx = sprite.getX() + (delta * moveSpeed * Math.sin(deg));
		var vy = sprite.getY() - (delta * moveSpeed * Math.cos(deg));

		if(vx < 0){ vx = Game.screenWidth(); }else if(vx > Game.screenWidth()){ vx = 0;	}
		if(vy < 0){ vy = Game.screenHeight(); }else if(vy > Game.screenHeight()){ vy = 0;	}

		sprite.setPosition([vx, vy]);
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
				if(curMP - attackCost >= 0){
					curMP = (curMP - attackCost < 0) ? 0 : curMP - attackCost;
					var bullet = new Projectile({
						radius: 8,
						fill: color,
						layer: layer,
						mageIdentifier: identifier,
					});
					Game.addEntity(bullet);
				}
				attackTimeStamp = 0;
			}
		}

		if(t) { 
			if(curEN > 0){
				curEN -= (dashCost * Game.delta);
				moveSpeed = 768; 
				if(!gameController.isUsed()){
					moveMage();
				}
			}else{
				moveSpeed = 96; 
			}
		}else{ 
			moveSpeed = 96;
		}
	};
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
		var y = sprite.getY() - ((sprite.getHeight()/2) + 8);
		playerName.setPosition([x, y]);	
	};
	var updateBars = function(){
		var x = sprite.getX();
		var y = sprite.getY() + sprite.getHeight()/2;
		var w = (sprite.getWidth()/2);
		hpBar.setWidth((curHP/maxHP) * w);
		hpBar.setPosition([x, y]);	
		y +=2;
		mpBar.setWidth((curMP/maxMP) * w);
		mpBar.setPosition([x, y]);	
		y +=2;
		enBar.setWidth((curEN/maxEN) * w);
		enBar.setPosition([x, y]);	
		resetNamePosition();
	};
	var regenStats = function(){
		if(regenTimeStamp == 0) regenTimeStamp = Game.time * 1000;
		else if((Game.time*1000) - regenTimeStamp > 1000){
			if(curHP < maxHP) curHP += hpRegen;
			if(curMP < maxMP) curMP += mpRegen;
			if(curEN < maxEN) curEN += enRegen;
			regenTimeStamp = 0;
		}
	};
};
/* END OF PROJECTILE CLASS */
