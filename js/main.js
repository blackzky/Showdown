var Device = {
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
		  }
};

var tellMeTheSizes=function(){
		  document.getElementById("viewportwidth").innerHTML = Device.width() + "px";
		  document.getElementById("viewportheight").innerHTML = Device.height() + "px";
		  document.getElementById("resolutionheight").innerHTML = screen.height + "px";
		  document.getElementById("resolutionwidth").innerHTML = screen.width + "px";
}

window.onload=function(){
		  tellMeTheSizes();

		  if(typeof(WebSettings) != 'undefined'){
					 WebSettings.setBuiltInZoomControls(false);
		  }
		  window.scrollTo(0, 1);
}

window.onresize=function(){
		  tellMeTheSizes();
}

window.onmousemove=function(event){
		  ev = event || window.event;
		  document.getElementById("mousetop").innerHTML = ev.pageY + "px";
		  document.getElementById("mouseleft").innerHTML = ev.pageX + "px";
}
