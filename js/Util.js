window.Util = window.Util || {}

Util.isDefined = function(object, cb){
	if(typeof(object) != "undefined" && object != null){
		if(typeof(cb) != "undefined") cb();
		return true;
	}else{
		return false;
	}
};

Util.pointInBox = function(point, box){
	var px = point.x,
		py = point.y,
		bx = box.x,
		by = box.y,
		bw = box.w,
		bh = box.h;
	return (px > bx && px < bx+bw && py > by && py <by+bh);
}

Util.collide = function(e1, e2){
	return( (e1.x >= e2.x && e1.x <= (e2.x + e2.w) && e1.y >= e2.y && e1.y <= (e2.y + e2.h)) ||
			((e1.x+e1.w) >= e2.x && (e1.x+e1.w) <= (e2.x + e2.w) && e1.y >= e2.y && e1.y <= (e2.y + e2.h)) || 
			((e1.x+e1.w) >= e2.x && (e1.x+e1.w) <= (e2.x + e2.w) && (e1.y+e1.h) >= e2.y && (e1.y+e1.h) <= (e2.y + e2.h)) ||
			(e1.x >= e2.x && e1.x <= (e2.x + e2.w) && (e1.y+e1.h) >= e2.y && (e1.y+e1.h) <= (e2.y + e2.h))
	);

}

