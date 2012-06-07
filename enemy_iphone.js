function FightEnemy(enemyData){
	var win = Ti.UI.createWindow({
		width:640/2,
		height:960/2,
		backgroundColor:'#000',
		navBarHidden:true
	})
	
	var game = quicktigame2d.createGameView();
	var transform  = quicktigame2d.createTransform();
	var fireAttack  = quicktigame2d.createTransform();
	var enemyFireAttack  = quicktigame2d.createTransform();
	
	game.debug = true;
	game.fps = 30;
	game.color(0, 0, 0);
	game.screen = {width: 640, height:960};
	// Create scene
	var scene = quicktigame2d.createScene();
	game.pushScene(scene);
	
	var avatar;
	if(at2x == '@2x'){
		avatar = currentUser.avatar.replace('.','@2x.')
	}
	// Create my ship instance
	var bg = quicktigame2d.createSprite({image:imageLoc + 'enemyRoom01' + at2x + '.png', width:640, height:960});
	var troll = quicktigame2d.createSprite({image:imageLoc + 'nodes/icon-troll' + at2x + '.png', width:128, height:128});
	var me = quicktigame2d.createSprite({image:imageLoc + avatar, width:128, height:128});
	var lootIcon = quicktigame2d.createSprite({image:imageLoc + 'icon-loot' + at2x + '.png', width:128, height:128});
	var firepot_particle  = quicktigame2d.createParticles({image:'particles/firepot.pex'});
	var attack01_particle  = quicktigame2d.createParticles({image:'particles/attack01.pex'});
	var enemyAttack01_particle  = quicktigame2d.createParticles({image:'particles/enemyAttack01.pex'});
	
	var screenTouchSprite  = quicktigame2d.createParticles();
	
	firepot_particle.move(195,850);
	troll.move(250,200);
	me.move(250,800);
	attack01_particle.move(me.x,me.y);
	enemyAttack01_particle.move(troll.x,troll.y);
	lootIcon.x = troll.x+(troll.width/2);
	lootIcon.y = troll.y+(troll.height/2);

	scene.add(bg);
	scene.add(troll);
	scene.add(me);
	scene.add(firepot_particle);
	scene.add(enemyAttack01_particle);
	enemyAttack01_particle.hide();
	
	bg.show();
	troll.show();
	firepot_particle.show();
	
	transform.duration = 1000;
	transform.autoreverse = true;
	transform.repeat = 10000;
	//transform.x = 200;
	//transform.y = 200;
	transform.scale(1.05, 1.05);

	troll.transform(transform);
	me.transform(transform);
	
	win.add(game);
	
	game.start();
	
	var button = Ti.UI.createButton({
		width:100,
		height:25,
		title:'Fire',
		right:5,
		bottom:5
	})
	var button2 = Ti.UI.createButton({
		width:100,
		height:25,
		title:'Block',
		left:5,
		bottom:5
	})
	var imageLoot = Ti.UI.createImageView({
		width:128/2,
		height:128/2,
		image:imageLoc + 'icon-loot.png',
		center:{x:0,y:0}
	})
	imageLoot.addEventListener('click',function(){
		win.close();
	})
	win.add(button);
	win.add(button2);
	
	enemyFireAttack.duration = 2000;
	var enemyHit;
	var blocking = false;
	
	var enemyAttackTimer = setInterval(function(){
		
		enemyFireAttack.x = me.x+(me.width/2);
		enemyFireAttack.y = me.y+(me.height/2);
		enemyAttack01_particle.show();
		enemyAttack01_particle.transform(enemyFireAttack);
		enemyHit = setInterval(function(){
			if(enemyAttack01_particle.collidesWith(me)){
				if(!blocking){
					var blood01_particle = quicktigame2d.createParticles({image:'particles/blood01.pex'});
					blood01_particle.x = me.x+(me.width/2);
					blood01_particle.y = me.y+(me.height/2);
					scene.add(blood01_particle);
				}
				clearInterval(enemyHit);
				enemyFireAttack.x = troll.x;
				enemyFireAttack.y = troll.y;
				enemyAttack01_particle.hide();
			}
		},100)
	},6000)
	
	
	button.addEventListener('click',function(){
		attack01_particle.move(me.x+(me.width/2),me.y+(me.height/2));
		fireAttack.duration = 2500;
		fireAttack.x = troll.x+(troll.width/2);
		fireAttack.y = troll.y+(troll.height/2);
		
		scene.add(attack01_particle);
		attack01_particle.transform(fireAttack);
		
		var killShot = setInterval(function(){
			if(attack01_particle.collidesWith(troll)){
				scene.remove(troll);
				scene.remove(attack01_particle)
				imageLoot.center = {x:troll.x/2,y:troll.y/2};
				win.add(imageLoot);
				clearInterval(killShot);
				clearInterval(enemyAttackTimer);
				scene.remove(enemyAttack01_particle);
			}
		},100)
		
	})
	button2.addEventListener('touchstart',function(){
		blocking = true;
	})
	button2.addEventListener('touchend',function(){
		blocking = false;
		button2.enabled = false;
		button2.opacity = 0.5
		setTimeout(function(){
			button2.enabled = true;
			button2.opacity = 1;
		},3000)
	})
	
	win.open({modal:true})
}
