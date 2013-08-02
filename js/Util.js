window.Util = window.Util || {}

Util.isDefined = function(object, cb){
	if(typeof(object) != "undefined" && object != null){
		if(typeof(cb) != "undefined") cb();
		return true;
	}else{
		return false;
	}
};
