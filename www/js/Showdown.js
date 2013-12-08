var move_char_t = false;
var use_delta = true;
var app = {
    initialize: function(){
        this.bindEvents()
   }, bindEvents: function(){
        document.addEventListener('deviceready', this.onDeviceReady, false); 
    }, onDeviceReady: function(){
        app.receiveEvent('deviceready'); 
        
        Game.addSource("dPadContainer", "img/d-pad-container.png"); 
	Game.addSource("dPadCenter", "img/d-pad-center.png");
	Game.addSource("character", "img/character.png");
	Game.addSource("box", "img/box.png");
	Game.addSource("circle", "img/circle.png");
	Game.addSource("x", "img/x.png");
	Game.addSource("triangle", "img/triangle.png");
	Game.addState("Menu", menu);
	Game.start({container :"container"});
    } 
};
window.onload = function(){
	app.initialize();
}

window.onresize = function(){
	Game.setScreen();
}
