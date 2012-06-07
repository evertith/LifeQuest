//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  API                                                                    :::
//:::  Below is the links to the API calls, as well as the server location    :::
//:::  of the API.                                                            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// As we will be storing data in a database, we need to setup a link to the API RESTful service.
// This service can be hosted anywhere that NodeJS applications are accepted. (View the app.js file within the NodeJS directory for more information)
// For now, we will use the NodeJS server running on the localhost, at port 4000.  
var ipAddress = 'www.infoscanweb.com:4000';

// Here we just setup a couple of helper variables.  Since the Socket.IO-titanium module
// doesn't require the http:// prefix, we have separate variables.
var apiSocketServer = ipAddress; //Socket Server location
var apiServer = 'http://' + ipAddress + '/'; //Server location

// Here we setup the URI locations of our RESTful API calls.  These calls are setup in the
// app.js file located in the NodeJS folder.  These calls will be concatenated to the apiServer variable,
// thus, your api call will be to http://127.0.0.1:4000/user/new for instance.
var apiRegister = 'user/new'; //Add new user
var apiLogin = 'user/login'; //Login a user
var apiGetNodes = 'node'; //Get a list of nodes to add to the map
var apiNewItem = 'item/new'; //Add a new item to the database
var apiUpdateLoot = 'loot/update'; //Get new loots!
var apiGetUser = 'user/'; //Get a specific user info

// Here we setup the variable for the Socket.IO-titanium module.  This module allows
// real-time communication between clients and server, and vice versa. This is what
// you would use to implement multiplayer capabilities into a game.
var io = require('socket.io-titanium');

// This is actually a depreciated way to connect to the socket server.  I decided to go
// for the more flexable approach which is below.
var socket = io.connect(apiSocketServer);

// This is the preferred method to make connections to the socket server. These are called
// namespaces.  They basically allow you to split up the calls into groups, which helps not
// only with organization, but with server performance as well.  More information can be found
// at http://socket.io
var socketNodes = socket.of('/socket/nodes');
var socketUser = socket.of('/socket/user');
var socketItems = socket.of('/socket/items');
var socketAchievements = socket.of('/socket/achievements');
var socketInApp = socket.of('/socket/inapp');
//var socketXp = socket.of('/socket/xp');


//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  GLOBALS                                                                :::
//:::  Below are some global variables that can be set to change the behavior :::
//:::  of some items.                                                         :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// These are just some globals I have setup, since these are frequently used variables.
var serviceTimeout = 10000 //in milliseconds
var deviceWidth = Ti.Platform.displayCaps.platformWidth; //Device's width
var deviceHeight = Ti.Platform.displayCaps.platformHeight; //Device's height
var mapLatitude; //Current latitude of map
var mapLongitude; //Current longitude of map
var longitude; //Current longitude
var latitude; //Current latitude
var oldLat; //Previous latitude
var oldLng; //Previous longitude
var altitude; //Altitude
var heading; //Compass direction
var accuracy; //GPS signal accuracy
var speed; //Speed of how fast you are traveling
var timestamp; 
var altitudeAccuracy;
var currentUser; //The current user's data in JSON format
var timeout;


//Application properties
Ti.App.Properties.setDouble('actiondistanceamount',0.00001) //This determines how close you need to be to a node on a map before you can interact with it.
Ti.App.Properties.setBool('playMusic',true);
Ti.App.Properties.setBool('playSounds',true);

//Sounds and music used in the game.

// Here we setup the default Geolocation settings needed for the application to run smoothly. We setup the necessary variables, 
// then we run checks on the user's device to make sure they have location services activated.
Ti.Geolocation.purpose = "LifeQuest Location Services"; // Required by iOS to inform the user what your application will be using location services for.
Ti.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST; // This sets the default accuracy for the Geolocation. We obviously want the best.
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS; // Setting this seems to help with getting a lock on your location. 
Titanium.Geolocation.showCalibration = false; // This hides the ever-so-annoying message about compass interference.  

// Do a bunch of checking to see if the user has location services turned on. If they don't, alert them appropriately.
if (Titanium.Geolocation.locationServicesEnabled === false)
{
	Titanium.UI.createAlertDialog({title:'LifeQuest Location Services', message:'Your device has location services turned off - turn it on.'}).show();
} else {
	var authorization = Titanium.Geolocation.locationServicesAuthorization;
	Ti.API.info('Authorization: '+authorization);
	if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
		Ti.UI.createAlertDialog({
			title:'LifeQuest Location Services',
			message:'You have disallowed LifeQuest from running location services.'
		}).show();
	}
	else if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
		Ti.UI.createAlertDialog({
			title:'LifeQuest Location Services',
			message:'Your system has disallowed LifeQuest from running location services.'
		}).show();
	}
}




// This is the game engine that we will use. More information can be found at http://code.google.com/p/quicktigame2d
var quicktigame2d = require('com.googlecode.quicktigame2d'); //Game engine



//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  Helper Functions                                                       :::
//:::  Below are the helper functions.  These perform common tasks.           :::
//:::  of the API.                                                            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//Format number to currency
function CurrencyFormatted(amount)
{
	var i = parseFloat(amount);
	if(isNaN(i)) { i = 0.00; }
	var minus = '';
	if(i < 0) { minus = '-'; }
	i = Math.abs(i);
	i = parseInt((i + .005) * 100);
	i = i / 100;
	s = new String(i);
	if(s.indexOf('.') < 0) { s += '.00'; }
	if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
	s = minus + s;
	s = '$' + s;
	return s;
}

//Calculate distance between two points in miles.  Use K as the unit for kilometers
function distance(lt1, ln1, lt2, ln2, unit) {
	var radlat1 = Math.PI * lt1/180
	var radlat2 = Math.PI * lt2/180
	var radlon1 = Math.PI * ln1/180
	var radlon2 = Math.PI * ln2/180
	var theta = ln1-ln2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}

//Convert number to radians
Number.prototype.toRad = function(){
    return this * Math.PI / 180;
}

// This is a timeout helper function.  If the RESTful API service doesn't respond within the specified timeout stated above,
// then we alert the user that it's not responding.
function ServiceConnectTimeout(){
	// test service connectivity
	timeout = setTimeout(function(){
		alert('LifeQuest web services are not responding. Please try again in a few minutes.')
		actLogin.hide();
	},serviceTimeout)
}
Ti.API.error('3')

// This is an Experience window that is shown each time a user gains experience from a task.
// This window will overlay on top of the current window that is shown for 1 to 2 seconds.
function ShowExperienceWin(data){
	// Create the window
	var experienceWin = Ti.UI.createWindow({
		width:640/2,
		height:200/2,
		backgroundColor:'transparent',
		opacity:0,
		zIndex:0,
		bottom:0,
		touchEnabled:false
	})
	
	// Create the label for the text, using a custom font
	var experienceText = Ti.UI.createLabel({
		width:640/2,
		height:'auto',
		font:{fontSize:28,fontFamily:'Big Caslon'},
		color:'#ffff00',
		text:'+' + data.experienceAmount + ' experience gained!',
		textAlign:'center',
		bottom:60/2
	})
	
	// Add the text to the window
	experienceWin.add(experienceText);
	
	// Open the window
	experienceWin.open();
	
	// Since the window's opacity was initially set to 0,
	// we want to animate the opacity to 1 to give a nice
	// fade in effect.  Once that animation completes,
	// we will animate the same window again to an opacity
	// of 0, which will fade it out.  Once the second animation
	// completes, we close the window to remove it from the stack.
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
}
