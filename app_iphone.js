/*
 * LifeQuest - Appcelerator Titanium
 * Version 1.0
 * 
 * The purpose of this application is to demonstrate the aspects of game development in Appcelerator Titanium.
 * Several open-source modules are used in conjunction with this application. 
 * 
 * QuickTIGame2D - http://code.google.com/p/quicktigame2d
 * StoreKit - https://marketplace.appcelerator.com/apps/794?1518628877
 * Socket.IO-titanium - https://github.com/nowelium/socket.io-titanium
 * 
 * This application will cover development from the frontend, to the backend.  
 *  - We will use a NodeJS Express server to serve a RESTful API.
 *  - We will use MongoDB, a NoSQL database, to store information
 * 
 * If you have any questions, feel free to contact me at evertith@gmail.com, or leave a comment on CodeCanyon.
 * Good luck with your game development!
 */

// ****************************************************************************************************************
// Lets begin with an inclusion.  This include basically sets up the global variables used throughout the application.
// Some may argue against global variables, but I think they are fine to use.
// This include also has some helper functions that are used throughout the application.
// So, lets include the file for use.  We include it at the very first so anything that uses it's contents can reference it.
// Open up the api/main.js file to see what is going on with it.
Titanium.include('api/main.js')

//Create socket variable
var connectingSocket = null; // Experiemental variable


// This call only fires once, when you start the application.  It just gets your current location. Sometimes it's accurate, sometimes it's not,
// since you may not get a good lock on your location right off the bat. 
Titanium.Geolocation.getCurrentPosition(function(e)
{
	if (!e.success || e.error)
	{
		return;
	} else {
		// If there were no errors, set the global variables to the data that was returned.
		longitude = e.coords.longitude;
		latitude = e.coords.latitude;
		altitude = e.coords.altitude;
		heading = e.coords.heading;
		accuracy = e.coords.accuracy;
		speed = e.coords.speed;
		timestamp = e.coords.timestamp;
		altitudeAccuracy = e.coords.altitudeAccuracy;
		
		// Modify the distance needed to interact with nodes based on the current accuracy of our location. If 
		// it's not very accurate, this will allow a user to be further away from a node and still be able to
		// interact with it.
		Ti.App.Properties.setDouble('actiondistanceamount',0.00001*accuracy)
	}
});

// Require the music/sound effects module
var Sounds = require('api/sounds');

var sounds = new Sounds();


// Here we figure out if the user has a retina display on their device or not. If they do, we use a different folder
// for images.  All retina images need the @2x extension in order to be used correctly. iOS concatinates a @2x extension
// onto an image link to use the retina version.  For instance, if you have an image that points to images/test.jpg, and
// you have a retina screen, iOS will attempt to locate this image instead: images/test@2x.jpg.  If that image does not
// exist, it will fall back to the original images/test.jpg. Regardless if the resolution of the images are the same,
// it will not be retina if the test@2x.jpg image does not exist.
var imageLoc = Ti.Platform.displayCaps.density === 'medium' ? 'images/normal/' : 'images/retina/';
var at2x = Ti.Platform.displayCaps.density === 'medium' ? '' : '@2x'; // Experimental variable

// This is our main window.  This holds the navigation group, which we will use to navigate around the application. Navigation
// groups are the way to go with window management in iOS.
var navWin = Ti.UI.createWindow({
	width:640/2,
	height:960/2,
	navBarHidden:true
})

// This is our 'first' window.  This window will be where the user logs in or registers a new account. This will be the starter
// window for the navigation group when the application first begins.
var win = Ti.UI.createWindow({
	width:640/2,
	height:960/2,
	backgroundColor:'#fff',
	backgroundImage:imageLoc + 'mainBg.jpg',
	navBarHidden:true
})

// This is our explore banner at the bottom of the screen once the user is logged in. The reason we put this
// here, is because we want it to show up on top of everything else. So, this will show on top of the navigation
// group, thus any windows that are opened with the navigation group will be underneath this bottom banner.
var explore = Ti.UI.createView({
	width:640/2,
	height:127/2,
	backgroundImage:imageLoc + 'exploreBg.png',
	bottom:-127
})

// This is just the text for the banner. It's actually an image created in Photoshop to give it some neat effects.
var exploreText = Ti.UI.createView({
	width:262/2,
	height:83/2,
	backgroundImage:imageLoc + 'exploreText.png',
	bottom:2
})

// Lets add the text image to the explore banner.
explore.add(exploreText);

// Whenever a user clicks on the explore banner, the map will show up.  We also want to hide the explore text to 
// allow room for buttons, information, etc in the bottom banner.
explore.addEventListener('click',function(){
	ShowMap();
	var anim = Ti.UI.createAnimation();
	anim.bottom = -100;
	anim.duration = 400;
	exploreText.animate(anim);
})

// Here, we great our main navigration group.  This navigation group will be used for all of the main windows of the
// application.  Here, we set the initial window to the win we initilized above.
var nav = Ti.UI.iPhone.createNavigationGroup({
	window:win,
});

// Now, we add the navigation group to the main container window.
navWin.add(nav);

// Then we add the explore banner that will show up at the bottom of the window once we login.
navWin.add(explore);

// From here, to a ways down, we add our necessary images and buttons.  These are pretty straight forward.
var imgLogo = Ti.UI.createImageView({
	width:630/2,
	height:267/2,
	image:imageLoc + 'logo.png',
	top:-267/2,
	opacity:0
})

var btnLogin = Ti.UI.createView({
	width:640/2,
	height:158/2,
	backgroundImage:imageLoc + 'btnBg.png',
	left:390/2
})
var btnRegister = Ti.UI.createView({
	width:640/2,
	height:158/2,
	backgroundImage:imageLoc + 'btnBg.png',
	left:390/2,
	top:550/2
})

var btnLoginAction = Ti.UI.createButton({
	width:121/2,
	height:130/2,
	backgroundImage:imageLoc + 'btnLogin-action.png',
	backgroundSelectedImage:imageLoc + 'btnLogin-action.png',
	right:-12/2
})

var btnRegisterAction = Ti.UI.createButton({
	width:121/2,
	height:130/2,
	backgroundImage:imageLoc + 'btnLogin-action.png',
	backgroundSelectedImage:imageLoc + 'btnLogin-action.png',
	right:-12/2
})

var lblLogin = Ti.UI.createLabel({
	width:'auto',
	height:'auto',
	font:{fontSize:20,fontFamily:'Big Caslon'},
	text:'LOGIN',
	top:45/2,
	left:32/2,
	color:'#fff'
})

var lblRegister = Ti.UI.createLabel({
	width:'auto',
	height:'auto',
	font:{fontSize:20,fontFamily:'Big Caslon'},
	text:'REGISTER',
	top:45/2,
	left:35/2,
	color:'#fff'
})

var txtUsername = Ti.UI.createTextField({
	width:225/2,
	height:50/2,
	backgroundColor:'#fff',
	color:'#000',
	keyboardType:Ti.UI.KEYBOARD_EMAIL,
	font:{fontSize:13,fontFamily:'Big Caslon'},
	borderRadius:4,
	top:40/2,
	left:250/2,
	hintText:'Username',
	returnKeyType:Ti.UI.RETURNKEY_NEXT
})

var txtPassword = Ti.UI.createTextField({
	width:225/2,
	height:50/2,
	backgroundColor:'#fff',
	color:'#000',
	keyboardType:Ti.UI.KEYBOARD_EMAIL,
	font:{fontSize:13,fontFamily:'Big Caslon'},
	borderRadius:4,
	top:40/2,
	left:500/2,
	hintText:'Password',
	passwordMask:true,
	returnKeyType:Ti.UI.RETURNKEY_SEND
})



// This is an activity indicator for the login button.  When a user clicks thhe login button, the activity indicator will
// be shown as the RESTful services are contacted.
var actLogin = Titanium.UI.createActivityIndicator({
    style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
    left:9,
    top:9
});

// Event Listeners

//global
///socketUser.on('client_login',function(data){
//})

Ti.App.addEventListener('showAchievement',function(data){
	var achEarned = false;
	for(var i=0;i<currentUser.achievements.length;i++){
		if(currentUser.achievements[i].title == data.title){
			achEarned = true;
		}
	}
	if(!achEarned){
		var objData = {email:currentUser.email,achievement:data};
		socketAchievements.emit('addAchievement',objData)
		var achView = Ti.UI.createWindow({
			width:600/2,
			height:450/2,
			backgroundImage:imageLoc + 'achBG.png',
			opacity:0
		})
		var spikeView = Ti.UI.createImageView({
			width:600/2,
			height:450/2,
			image:imageLoc + 'achSpike.png'
		})
		var titleView = Ti.UI.createImageView({
			width:600/2,
			height:450/2,
			image:imageLoc + 'achTitle.png'
		})
		var achievementText = Ti.UI.createLabel({
			width:300/2,
			height:'auto',
			font:{fontSize:18,fontFamily:'Big Caslon'},
			color:'#2e2e2e',
			text:data.title,
			textAlign:'center'
		})
		
		var mainAnim = Ti.UI.createAnimation();
		mainAnim.opacity = 1;
		mainAnim.duration = 500;
		achView.animate(mainAnim);
		
		var anim = Ti.UI.createAnimation();
		anim.opacity = 0.5;
		anim.duration = 800;
		anim.repeat = 7;
		spikeView.animate(anim);
		anim.addEventListener('complete',function(){
			var mainAnim2 = Ti.UI.createAnimation();
			mainAnim2.opacity = 0;
			mainAnim2.duration = 400;
			achView.animate(mainAnim2);
			mainAnim2.addEventListener('complete',function(){
				achView.close();
			})
					
		})
	
		titleView.add(achievementText);
		
		achView.add(spikeView);
		achView.add(titleView);
		achView.open();
	}
})
Ti.App.addEventListener('showExperienceGained',function(data){
	var experienceWin = Ti.UI.createWindow({
		width:640/2,
		height:960/2,
		backgroundColor:'transparent',
		opacity:0,
	})
	
	var experienceText = Ti.UI.createLabel({
		width:640/2,
		height:'auto',
		font:{fontSize:18,fontFamily:'Big Caslon'},
		color:'#ffff00',
		text:data.experienceAmount,
		textAlign:'center',
		bottom:50/2
	})
	
	experienceWin.add(experienceText);
	experienceWin.open();
	
	var anim = Ti.UI.createAnimation();
	anim.opacity = 1;
	anim.duration = 400;
	experienceWin.animate(anim);
	anim.addEventListener('complete',function(){
		setTimeout(function(){
			var anim2 = Ti.UI.createAnimation();
			anim2.opacity = 0;
			anim2.duration = 400;
			experienceWin.animate(anim2);
			anim2.addEventListener('complete',function(){
				experienceWin.close();
			})
		},1000)
	})
})

Ti.App.addEventListener('loggedIn',function(data){
	sounds.stop({sound:sounds.titleScreen.music.sound})
	clearInterval(timeout);
	currentUser = data;
	txtUsername.blur();
	txtPassword.blur();
	actLogin.hide();
	ShowHome();
	var anim = Ti.UI.createAnimation();
	anim.bottom = 0;
	anim.duration = 400;
	explore.animate(anim);
	//ShowMap();
	//StartShooterGame();
});

//local
btnLoginAction.addEventListener('click',function(){
	sounds.play({sound:sounds.titleScreen.sfx.loginActionButton,isMusic:false})
	actLogin.show();
	//socketUser.emit('server_login',{email:txtUsername.value,pass:txtPassword.value});
	Login(txtUsername.value,txtPassword.value);
	ServiceConnectTimeout();
})
btnRegisterAction.addEventListener('click',function(){
	sounds.play({sound:sounds.titleScreen.sfx.registerActionButton,isMusic:false})
	var anim4 = Ti.UI.createAnimation();
	anim4.left = 390/2;
	anim4.duration = 600;
	btnRegister.animate(anim4);
	

	Registration();
})
txtUsername.addEventListener('focus',function(){
	sounds.play({sound:sounds.titleScreen.sfx.loginTextboxFocus,isMusic:false})
})
txtPassword.addEventListener('focus',function(){
	sounds.play({sound:sounds.titleScreen.sfx.loginTextboxFocus,isMusic:false})
})

txtUsername.addEventListener('return',function(){
	txtPassword.focus();
})
txtPassword.addEventListener('return',function(){
	sounds.play({sound:sounds.titleScreen.sfx.loginActionButton,isMusic:false})
	actLogin.show();
	Login(txtUsername.value,txtPassword.value);
	//socketUser.emit('server_login',{email:txtUsername.value,pass:txtPassword.value});
	ServiceConnectTimeout();
})
btnLogin.addEventListener('click',function(){
	sounds.play({sound:sounds.titleScreen.sfx.loginSlideOpen,isMusic:false})
	var anim = Ti.UI.createAnimation();
	anim.left = 0;
	anim.duration = 600;
	btnLogin.animate(anim);
	
	var anim2 = Ti.UI.createAnimation();
	anim2.left = 35/2;
	anim2.duration = 400;
	txtUsername.animate(anim2);

	var anim3 = Ti.UI.createAnimation();
	anim3.left = 285/2;
	anim3.duration = 400;
	txtPassword.animate(anim3);
	
	var anim4 = Ti.UI.createAnimation();
	anim4.left = 390/2;
	anim4.duration = 600;
	btnRegister.animate(anim4);
})
btnRegister.addEventListener('click',function(e){
	if(e.source.toString().indexOf('Button') == -1){
		sounds.play({sound:sounds.titleScreen.sfx.registerSlideOpen,isMusic:false})
		var anim = Ti.UI.createAnimation();
		anim.left = 0;
		anim.duration = 600;
		btnRegister.animate(anim);
		
		var anim2 = Ti.UI.createAnimation();
		anim2.left = 390/2;
		anim2.duration = 600;
		btnLogin.animate(anim2);
		
		var anim4 = Ti.UI.createAnimation();
		anim4.left = 250/2;
		anim4.duration = 400;
		txtUsername.animate(anim4);
	
		var anim3 = Ti.UI.createAnimation();
		anim3.left = 500/2;
		anim3.duration = 400;
		txtPassword.animate(anim3);
	}
})

// Populate controls
btnLoginAction.add(actLogin);

btnLogin.add(lblLogin);
btnLogin.add(btnLoginAction);
btnLogin.add(txtUsername);
btnLogin.add(txtPassword);

btnRegister.add(lblRegister);
btnRegister.add(btnRegisterAction);
                                        
win.add(imgLogo);                                                                                                                                                                                                                                                                                                                                                                                                         
win.add(btnLogin);
win.add(btnRegister);

//Animations
var imgLogoAnim = Ti.UI.createAnimation();
imgLogoAnim.top = 20/2;
imgLogoAnim.opacity = 1;
imgLogoAnim.duration = 600;
imgLogo.animate(imgLogoAnim);

// Open Windows
navWin.open();
sounds.play({sound:sounds.titleScreen.music.sound,isMusic:true})
//sounds.titleScreen.music.sound.start();

//Include api functions and variables
Titanium.include('api/login.js');
Titanium.include('api/register.js');
Titanium.include('api/nodes.js');
Titanium.include('api/inapp.js');
Titanium.include('api/newitem.js');
Titanium.include('api/loot.js');
Titanium.include('api/updateUser.js');
Titanium.include('api/newitem.js');

//Include additional files
Titanium.include('registration_iphone.js')
Titanium.include('map_iphone.js')
Titanium.include('minigame_shooter.js')
Titanium.include('minigame_dungeoncrawl.js')
Titanium.include('minigame_bubblepop.js')
Titanium.include('home_iphone.js');
Titanium.include('merchant_iphone.js');
Titanium.include('achievement_iphone.js');
Titanium.include('enemy_iphone.js');
Titanium.include('minigames_iphone.js')
