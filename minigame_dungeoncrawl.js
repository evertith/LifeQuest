function StartDungeonCrawlGame(){
	var window = Ti.UI.createWindow({backgroundColor:'black'});

	// Obtain game module
	var quicktigame2d = require('com.googlecode.quicktigame2d');
	
	// Create view for your game.
	// Note that game.screen.width and height are not yet set until the game is loaded
	var game = quicktigame2d.createGameView();
	
	// Frame rate can be changed (fps can not be changed after the game is loaded)
	game.fps = 30;
	
	// set initial background color to black
	game.color(0, 0, 0);
	
	game.debug = true;
	
	// Create game scene
	var scene = quicktigame2d.createScene();
	
	// create sprites
	var dog = quicktigame2d.createSpriteSheet({image:'images/dog.png', width:34, height:42, border:1, margin:1});
	
	// on-screen controller and its guides
	var vpad = quicktigame2d.createSprite({image:'images/control_base.png'});
	var vpad_nav = quicktigame2d.createSprite({image:'images/particle.png'});
		
	dog.move(150,150)
	
	vpad_nav.hide();
	vpad_nav.color(1, 1,  0);
	vpad.alpha = 0.5;
	var GRAPHICS_DIR = 'images/';
	
	
	// create map sprite manually
	
	var map = quicktigame2d.createMapSprite({image:'images/test2.png', tileWidth:100, tileHeight:100, border:0, margin:0});
	
	// create 40x40 map
	map.width  = map.tileWidth  * 18;
	map.height = map.tileHeight * 18;
	
	// initialize map data
	var tileArray = [];
	for(var i=0;i<324;i++){
		tileArray.push(i);
	}
	map.tiles = tileArray;
	
	
	
	// create map sprite from JSON file exported by tiled map editor
	// http://www.mapeditor.org/
	//	
	// create items map layer
	// set z-order
	
	map.z  = 0;
	dog.z  = 2;
	vpad.z = 3;
	vpad_nav.z = 4;
	
	// add your shape to the scene
	scene.add(dog);
	scene.add(vpad);
	scene.add(vpad_nav);
	scene.add(map);
	// add your scene to game view
	game.pushScene(scene);
	
	var WINDOW_SCALE_FACTOR_X = 1;
	var WINDOW_SCALE_FACTOR_Y = 1;
	
	var isVpadActive = false;
	var touchX, touchY;
	var canMoveX = true;
	var canMoveY = true;
	
	var walls = [];

	AddWall(10,210,90,90,false,true,{r:1,b:0,g:0});
	AddWall(210,10,90,90,true,false);
	AddWall(10,110,300,90,false,true);
	AddWall(10,110,300,90,false,true);

	function AddWall(width,height,x,y,moveX,moveY){
		var newWall = quicktigame2d.createSprite({width:width,height:height,x:x,y:y,moveX:moveX,moveY:moveY});
		newWall.color(1,0,0);
		scene.add(newWall);
		walls.push(newWall)
	}
	
	
	
	// Onload event is called when the game is loaded.
	// The game.screen.width and game.screen.height are not yet set until this onload event.
	game.addEventListener('onload', function(e) {
	        // set screen size for your game (non-retina size)
	    var screenScale = 0.5//game.size.width / 320;
	    game.screen = {width:game.size.width / screenScale, height:game.size.height / screenScale};
	        
	    // Your game screen size is set here if you did not specifiy game width and height using screen property.
	    // Note: game.size.width and height may be changed due to the parent layout so check them here.
	    Ti.API.info("view size: " + game.size.width + "x" + game.size.height);
	    Ti.API.info("game screen size: " + game.screen.width + "x" + game.screen.height);
	    
	    Ti.API.info("map: " + map.width + "x" + map.height);
	    
	    WINDOW_SCALE_FACTOR_X = game.screen.width  / game.size.width;
	    WINDOW_SCALE_FACTOR_Y = game.screen.height / game.size.height;
	    
	    vpad.x = (game.screen.width * 0.5) - (vpad.width * 0.5);
	    vpad.y = game.screen.height - vpad.height;
	    
	    // Start the game
	    game.start();
	
	        // default direction is "RIGHT"    
	    dog.direction = "RIGHT";
	    dog.animate(0, 2, 250, -1);
	    
	        setInterval(function(e) {
	                updateVpad();
	        }, 66);
	});
	
	function updateVpad() {
	    if (isVpadActive) {
	                var powerX = (touchX - (vpad.x + (vpad.width  * 0.5))) * 0.2;
	                var powerY = (touchY - (vpad.y + (vpad.height * 0.5))) * 0.2;
	        
	        vpad.color(0.78, 0.78, 0.78);
	        vpad_nav.x = touchX - (vpad_nav.width  * 0.5);
	        vpad_nav.y = touchY - (vpad_nav.height * 0.5);
	        vpad_nav.show();
	        
	        // Change animation of the dog sprite
	        if (dog.direction == "RIGHT" && powerX < 0) {
	                dog.direction = "LEFT";
	                dog.animate(5, 2, 250, -1);
	        } else if (dog.direction == "LEFT" && powerX > 0){
	                dog.direction = "RIGHT";
	                    dog.animate(0, 2, 250, -1);
	        }
	        
	        var nextDogX = dog.x + powerX;
	        var nextDogY = dog.y + powerY;
	        
	        var nextMapX = map.x - powerX;
	        var nextMapY = map.y - powerY;
	        
	        for(var i=0;i<walls.length;i++){
			    if(walls[i].contains(nextDogX,nextDogY)){
			    	canMoveX = walls[i].moveX;
			    	canMoveY = walls[i].moveY;
			    }

	        }
	        
	        
	        // move dog and map layers
	        Ti.API.info(nextDogX + ' - ' + nextDogY)
	        if (nextDogX > 0 && nextDogX < game.screen.width  - dog.width) {
            		dog.x = nextDogX;
	        } else if (nextDogX > 0 && nextDogX > game.screen.width  - dog.width){
        		var transform  = quicktigame2d.createTransform();
        		var transform1  = quicktigame2d.createTransform();
        		
        		transform.x = map.x - 640;
        		transform.duration = 500;
        		map.transform(transform);
        		transform1.x = 0
        		transform1.duration = 500;
        		dog.transform(transform1);
        		
                //map.x = map.x - 640;
                //dog.x = 0;
	        } else if (nextDogX <= 0 && nextDogX > -game.screen.width  - dog.width){
        		var transform  = quicktigame2d.createTransform();
        		var transform1  = quicktigame2d.createTransform();
        		
        		transform.x = map.x + 640;
        		transform.duration = 500;
        		if(map.x != 0){
        			map.transform(transform);
        		}
        		
        		transform1.x = 600
        		transform1.duration = 500;
        		dog.transform(transform1);
                //map.x = map.x + 640;
                //dog.x = 600;
	        }
	        if (nextDogY > 0 && nextDogY < game.screen.height - dog.height) {
            		dog.y = nextDogY;
	        } else if (nextDogY > 0 && nextDogY > game.screen.height  - dog.height){
        		var transform  = quicktigame2d.createTransform();
        		var transform1  = quicktigame2d.createTransform();
        		
        		transform.y = map.y - 960;
        		transform.duration = 500;
        		map.transform(transform);
        		transform1.y = 0
        		transform1.duration = 500;
        		dog.transform(transform1);
        		
                //map.x = map.x - 640;
                //dog.x = 0;
	        } else if (nextDogY <= 0 && nextDogY > -game.screen.height  - dog.height){
        		var transform  = quicktigame2d.createTransform();
        		var transform1  = quicktigame2d.createTransform();
        		
        		transform.y = map.y + 960;
        		transform.duration = 500;
        		if(map.y != 0){
        			map.transform(transform);
        		}
        		
        		transform1.y = 920
        		transform1.duration = 500;
        		dog.transform(transform1);
                //map.x = map.x + 640;
                //dog.x = 600;
	        }

	        
	    } else {
            vpad.color(1, 1, 1);
            vpad_nav.hide();
	    }
	}
	
	game.addEventListener('touchstart', function(e) {
	    touchX = (e.x * WINDOW_SCALE_FACTOR_X);
	    touchY = (e.y * WINDOW_SCALE_FACTOR_Y);
	    
	    isVpadActive = vpad.contains(touchX, touchY);
	});
	
	game.addEventListener('touchmove', function(e) {
	    touchX = (e.x * WINDOW_SCALE_FACTOR_X);
	    touchY = (e.y * WINDOW_SCALE_FACTOR_Y);
	    
	    isVpadActive = vpad.contains(touchX, touchY);
	});
	
	game.addEventListener('touchend', function(e) {
        isVpadActive = false;
	});
	
	// load debug functions
	
	// Add your game view
	window.add(game);
	window.open({fullscreen:true, navBarHidden:true});
	
	var exitButton = Ti.UI.createButton({
		title:'Exit',
		bottom:20,
		left:5
	})
	
	exitButton.addEventListener('click',function(){
		game.stop();
		window.close();
	})
	
	window.add(exitButton)
	
}
