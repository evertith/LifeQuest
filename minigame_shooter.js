function StartShooterGame(){
	/*
	 * Shooter game example 
	 * 
	 * Touch screen to move our ship. The bullets are fired automatically.
	 */
	var MAX_ENEMIES = 10;
	var MAX_BULLETS = 10;
	
	
	var window = Ti.UI.createWindow({backgroundColor:'black',navBarHidden:true});
	var countLabel = Ti.UI.createLabel({
		width:'auto',
		height:'auto',
		color:'#fff',
		top:5,
		left:5,
		text:'Enemies destroyed: 0'
	})
	
	// Obtain module and create game view
	var game = quicktigame2d.createGameView();
	var particle  = quicktigame2d.createParticles({image:'particles/ship_particle.pex'});
	var shipDestroy = quicktigame2d.createParticles({image:'particles/explosion2.pex'});
	
	game.debug = true;
	game.fps = 30;
	game.color(0, 0, 0);
	var fireInterval;
	
	// Create scene
	var scene = quicktigame2d.createScene();
	game.pushScene(scene);
	
	
	// Create my ship instance
	var myship = quicktigame2d.createSpriteSheet({image:'images/ship.png', width:24, height:29});
	
	
	// Transform object that reacts to user interaction
	var myshipMover = quicktigame2d.createTransform();
	var myshipParticleMover = quicktigame2d.createTransform();
	myshipMover.addEventListener('complete', function(e) {
	        myship.frame = 2;
	});
	
	
	// Initialize bullets, enemies and background
	var bullets = new Array(MAX_BULLETS);
	var bulletMover = new Array(MAX_BULLETS);
	var explosions = new Array(MAX_BULLETS);
	var bulletIndex = 0;
	
	
	var enemies = new Array(MAX_ENEMIES);
	var enemyMover = new Array(MAX_ENEMIES);
	var backgrounds;
	var backgroundMover;
	var backgroundFollowMover;
	
	
	var touchScale = 1;
	
	
	/*
	 * Initialize background
	 */
	function createBackground() {
	        backgrounds = [
	                quicktigame2d.createSpriteSheet({image: 'images/cloud.xml', frame:0}),
	                quicktigame2d.createSpriteSheet({image: 'images/cloud.xml', frame:1}),
	                quicktigame2d.createSpriteSheet({image: 'images/cloud.xml', frame:2}),
	                quicktigame2d.createSpriteSheet({image: 'images/cloud.xml', frame:3}),
	                quicktigame2d.createSpriteSheet({image: 'images/cloud.xml', frame:4})
	        ];
	        
	        backgroundMover = new Array(backgrounds.length);
	        backgroundFollowMover = new Array(backgrounds.length);
	        
	        for (var i = 0; i < backgrounds.length; i++) {
	                backgrounds[i].x = Math.random() * (game.screen.width - backgrounds[i].width);
	                backgrounds[i].y = Math.random() * (game.screen.height - backgrounds[i].height);
	                backgrounds[i].z = 0;
	                backgrounds[i].ready = true;
	                
	                scene.add(backgrounds[i]);
	                
	                backgroundMover[i] = quicktigame2d.createTransform();
	                backgroundMover[i].index = i;
	                backgroundMover[i].addEventListener('complete', function(e) {
	                        backgrounds[e.source.index].ready = true;
	                });
	                
	                backgroundFollowMover[i] = quicktigame2d.createTransform();
	        }
	}
	
	
	/*
	 * Initialize bullets
	 */
	function createBullets() {
	        for (var i = 0; i < MAX_BULLETS; i++) {
	        		//bullets[i] = quicktigame2d.createParticles({image:'ship_particle.pex'});
	                bullets[i] = quicktigame2d.createSpriteSheet({image:'images/bullet.xml'});
	                bullets[i].selectFrame("bullet3");
	                bullets[i].width = bullets[i].width * 2;
	                bullets[i].hide();
	                bullets[i].ready = true;
	                
	                explosions[i] = quicktigame2d.createSpriteSheet({image:'images/explosion2.png', width:12, height:12});
	                explosions[i].hide();
	                
	                bulletMover[i] = quicktigame2d.createTransform();
	                bulletMover[i].index = i;
	                
	                bulletMover[i].addEventListener('complete', function(e) {
	                        bullets[e.source.index].hide();
	                        bullets[e.source.index].ready = true;
	                });
	                scene.add(bullets[i]);
	                scene.add(explosions[i]);
	        }
	}
	
	
	/*
	 * Initialize enemies
	 */
	function createEnemies() {
	        
	        var enemyprop = [
	                {image:'images/enemy0.png', width:23, height:29, frame:1, speed: 120},
	                {image:'images/enemy1.png', width:19, height:25, frame:1, speed: 140},
	                {image:'images/enemy2.png', width:20, height:26, frame:1, speed: 160}
	        ];
	        
	        for (var i = 0; i < MAX_ENEMIES; i++) {
	                var rindex = parseInt(Math.random() * 3) % 3;
	                enemies[i] = quicktigame2d.createSpriteSheet(enemyprop[rindex]);
	                enemies[i].hide();
	                enemies[i].ready = true;
	                enemyMover[i] = quicktigame2d.createTransform();
	                enemyMover[i].index = i;
	                
	                enemyMover[i].addEventListener('complete', function(e) {
	                        enemies[e.source.index].hide();
	                        enemies[e.source.index].ready = true;
	                });
	                
	                scene.add(enemies[i]);
	        }
	}
	
	
	/*
	 * Move background, set speed of the movement slower than the enemies and my ship
	 * that enables kind of parallax background effect.
	 */
	function moveBackground() {
	        for (var i = 0; i < backgrounds.length; i++) {
	                if (!backgrounds[i].ready) continue;
	                
	                if (backgrounds[i].y >= game.screen.height) {
	                        backgrounds[i].x =  Math.random() * game.screen.width;
	                        backgrounds[i].y = -backgrounds[i].height;
	                }
	                
	                backgrounds[i].z = 0;
	                backgrounds[i].ready = false;
	                
	                backgroundMover[i].y = game.screen.height;
	                backgroundMover[i].duration = Math.abs(game.screen.height - backgrounds[i].y) / 50 * 1000;
	                
	                backgrounds[i].transform(backgroundMover[i]);
	        }
	}
	
	
	/*
	 * Check if enemies collides with bullets or ready to move
	 */
	var killCount = 0;
	var silver = 0;
	function checkEnemies() {
	        for (var i = 0; i < MAX_ENEMIES; i++) {
	                if (!enemies[i].ready) {
	                        for (var j = 0; j < MAX_BULLETS; j++) {
	                                if (!bullets[j].ready && enemies[i].collidesWith(bullets[j])) {
	                                        //explosions[j].x = enemies[i].x + (enemies[i].width  * 0.5);
	                                        //explosions[j].y = enemies[i].y + (enemies[i].height * 0.5);
	                                        //explosions[j].z = enemies[i].z + 1;
	                                        // Scale up the explosion bacause the image is too small.
	                                        //explosions[j].scale(4, 4);
	                                        //explosions[j].animate(0, 14, 33, 0);
	                                        //explosions[j].show();
	                                        
											var enemyDestroy = quicktigame2d.createParticles({image:'particles/enemyExplode.pex'});
	                                        enemyDestroy.x = enemies[i].x + (enemies[i].width  * 0.5);
	                                        enemyDestroy.y = enemies[i].y + (enemies[i].height * 0.5);
	                                        scene.add(enemyDestroy);
	                                        
	                                        enemies[i].hide();
	                                        enemies[i].clearTransforms();
	                                        enemies[i].ready = true;
	                                        
	                                        bullets[j].hide();
	                                        bullets[j].ready = true;
	                                        
	                                        killCount += 1;
	                                        countLabel.text = 'Enemies destroyed: ' + killCount
	                                        shipexplode.stop();
	                                        shipexplode.play();
	                                        break;
	                                } else if(enemies[i].collidesWith(myship)){
	                                	
	                                	shipDestroy.x = myship.x;
	                                	shipDestroy.y = myship.y;
	                                	
	                                	scene.add(shipDestroy);
	                                	scene.remove(particle);
	                                	shooter.stop();
	                                	cannonSound.stop();
	                                	cannonSound.play();
	                                	myship.hide();
	                                	clearInterval(fireInterval);
	                                	setTimeout(function(){
	                                		nav.close(window);
	                                	},5000)
	                                }
	                        }
	                        continue;
	                }
	                
	                enemies[i].x =  enemies[i].width  +(Math.random() * (game.screen.width  - enemies[i].width));
	                enemies[i].y = -enemies[i].height -(Math.random() * (game.screen.height * 0.5));
	                enemies[i].z = myship.z + 1;
	                enemies[i].ready = false;
	                enemies[i].show();
	                
	                enemyMover[i].x = Math.random() > 0.8 ? enemies[i].x : myship.x;
	                enemyMover[i].y = game.screen.height;
	                
	                var distanceX = enemies[i].x - enemyMover[i].x;
	                var distanceY = enemies[i].y - enemyMover[i].y;
	                var distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
	                enemyMover[i].duration = distance / enemies[i].speed * 1000;
	
	
	                if (distanceX > game.screen.width * 0.25) {
	                        enemies[i].frame = 0;
	                } else if (-distanceX > game.screen.width * 0.25) {
	                        enemies[i].frame = 2;
	                } else {
	                        enemies[i].frame = 1;
	                }
	                        
	                enemies[i].transform(enemyMover[i]);
	        }
	}
	function getInitialBulletYPosition() {
	        return myship.y - (bullets[0].height);
	}
	function getInitialBulletXPosition(){
	        return myship.x + (myship.width * 0.5) - (bullets[0].width * 0.5);
	}
	
	
	var lastTimeBulletFired = 0;
	
	
	/*
	 * Fire next bullet
	 */
	function fireBullet() {
	        // Wait 200 msec for firing next bullet
	        if (+new Date() - lastTimeBulletFired > 200 && bullets[bulletIndex].ready) {
	                bullets[bulletIndex].clearTransform(bulletMover[bulletIndex]);
	                
	                bullets[bulletIndex].x = getInitialBulletXPosition();
	                bullets[bulletIndex].y = getInitialBulletYPosition();
	                bullets[bulletIndex].z = myship.z + 1;
	                bullets[bulletIndex].ready = false;
	                bullets[bulletIndex].show();
	                bulletMover[bulletIndex].x = getInitialBulletXPosition();
	                bulletMover[bulletIndex].y = -bullets[bulletIndex].height;
	                bulletMover[bulletIndex].duration = (bullets[bulletIndex].y + bullets[bulletIndex].height) / 150 * 1000;
	                bullets[bulletIndex].transform(bulletMover[bulletIndex]);
	                
	                bulletIndex++;
	                if (bulletIndex >= MAX_BULLETS) {
	                        bulletIndex = 0;
	                }
	                
	                lastTimeBulletFired = +new Date();
	                laser.stop();
	                laser.play();
	        }
	}
	
	
	/*
	 * Move my ship at the bottom of the screen
	 */
	function initMyShip() {
	        myship.x = (game.screen.width * 0.5) - (myship.width * 0.5)
	        myship.y = game.screen.height - (myship.height * 2);
	        myship.z = 1;
	        myship.frame = 2;
	}
	
	
	game.addEventListener('onload', function(e) {
	        var sscale = game.height / 480;
	        game.screen = {width:game.width / sscale, height:game.height / sscale};
	        
	        touchScale = game.screen.width / game.width;
	        
	        initMyShip();
	
			particle.x = myship.x+15;
			particle.y = myship.y+40;
	
	        scene.add(myship);
			scene.add(particle);
	
	        createBackground();
	        createBullets();
	        createEnemies();
	        
	    game.start();
	    
	        fireInterval = setInterval(function(e) {
	                moveBackground();
	                
	                checkEnemies();
	                fireBullet();
	        }, 100);
	});
	
	
	/*
	 * Move our ship at the center of the touch-event position
	 * Move the background a bit, that causes parallized effect
	 */
	game.addEventListener('touchstart', function(e) {
	        myship.clearTransform(myshipMover);
	        particle.clearTransform(myshipParticleMover);
	        
	        myshipMover.x = e.x * touchScale;
	        myshipMover.y = e.y * touchScale;
	        myshipMover.easing = quicktigame2d.ANIMATION_CURVE_CUBIC_OUT;
	        
	        myshipParticleMover.x = e.x * touchScale;
	        myshipParticleMover.y = e.y * touchScale;
	        myshipParticleMover.easing = quicktigame2d.ANIMATION_CURVE_CUBIC_OUT;

	        var distanceX = myship.x - myshipMover.x;
	        var distanceY = myship.y - myshipMover.y;
	        var particleDistanceX = (particle.x+15) - (myshipParticleMover.x+15);
	        var particleDistanceY = (particle.y+40) - (myshipParticleMover.y+40);
	        
	        var distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
	        myshipMover.duration = distance / 50 * 1000;
	        
	        var particleDistance = Math.sqrt(Math.pow(particleDistanceX, 2) + Math.pow(particleDistanceY, 2));
	        myshipParticleMover.duration = particleDistance / 50 * 1000;
	        
	        myshipParticleMover.x += 15;
	        myshipParticleMover.y += 20;

	        myship.frame  = myship.x > myshipMover.x ? 0 : 4;
	        myship.transform(myshipMover);
	        particle.transform(myshipParticleMover);
	        
	        for (var i = 0; i < backgrounds.length; i++) {
	                backgrounds[i].clearTransform(backgroundFollowMover[i]);
	                
	                backgroundFollowMover[i].x = backgrounds[i].x + (distanceX * 0.2);
	                backgroundFollowMover[i].duration = 1000;
	                backgrounds[i].transform(backgroundFollowMover[i]);
	        }
			//particle.x = myshipMover.x;
			//particle.y = myshipMover.y;
	});
	
	
	game.debug = true;
	
	
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
	
	window.add(game);
	window.add(countLabel);
	//window.open({fullscreen:true, navBarHidden:true});
	nav.open(window);
	
	shooter.stop();
	shooter.play();
}