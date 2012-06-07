function StartBubblePopGame(){
	var window = Ti.UI.createWindow({backgroundColor:'black',navBarHidden:true});
	var game = quicktigame2d.createGameView();
	var particle  = quicktigame2d.createParticles({image:'particles/ballPop.pex'});
	
	game.debug = true;
	game.fps = 30;
	game.color(0, 0, 0);
	
	// Create scene
	var scene = quicktigame2d.createScene();
	game.pushScene(scene);
	
	//
	// prints out fps(frame per second) on every 5 seconds
	//
	game.enableOnFpsEvent = true; // onfps event is disabled by default so enable this
	game.onFpsInterval    = 5000; // set onfps interval msec (default value equals 5,000 msec)
	
	
	game.addEventListener('onfps', function(e) {
	        Ti.API.info(e.fps.toFixed(2) + " fps");
	});
	
	
	quicktigame2d.addEventListener('onlowmemory', function(e) {
	    Ti.API.warn("Low Memory");
	});
	
	window.addEventListener('click',function(e){
		particle.x = e.x;
		particle.y = e.y;
		
		scene.add(particle);
	})
	
	window.add(game);
}
