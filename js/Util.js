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
