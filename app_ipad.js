//Include main functions and variables
Titanium.include('api/main.js')

//Set Geolocation settings
Ti.Geolocation.purpose = "LifeQuest Location Services";
Ti.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
Ti.Geolocation.distanceFilter = 10;
Titanium.Geolocation.showCalibration = false;
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

//Set image location based on retina and device
var imageLoc = Ti.Platform.displayCaps.density === 'medium' ? 'images/ipad/normal/' : 'images/ipad/retina/';

var win = Ti.UI.createWindow({
	width:1536/2,
	height:2048/2,
	backgroundColor:'#fff',
	backgroundImage:imageLoc + 'mainBg.jpg'
})

var imgLogo = Ti.UI.createImageView({
	width:1430/2,
	height:546/2,
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
	font:{fontSize:20,fontWeight:'Bold'},
	text:'LOGIN',
	top:45/2,
	left:32/2,
	color:'#fff'
})

var lblRegister = Ti.UI.createLabel({
	width:'auto',
	height:'auto',
	font:{fontSize:20,fontWeight:'Bold'},
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
	font:{fontSize:13,fontWeight:'normal'},
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
	font:{fontSize:13,fontWeight:'normal'},
	borderRadius:4,
	top:40/2,
	left:500/2,
	hintText:'Password',
	passwordMask:true,
	returnKeyType:Ti.UI.RETURNKEY_SEND
})

//Activity Indicators
var actLogin = Titanium.UI.createActivityIndicator({
    style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
    left:-14/2,
    top:-20/2
});

// Event Listeners

//global
Ti.App.addEventListener('loggedIn',function(e){
	alert('We are logged in!');
})

//local
btnLoginAction.addEventListener('click',function(){
	actLogin.show();
	Login(txtUsername.value,txtPassword.value);
})
btnRegisterAction.addEventListener('click',function(){
	var anim4 = Ti.UI.createAnimation();
	anim4.left = 390/2;
	anim4.duration = 600;
	btnRegister.animate(anim4);

	Registration();
})
txtUsername.addEventListener('return',function(){
	txtPassword.focus();
})
txtPassword.addEventListener('return',function(){
	actLogin.show();
	Login(txtUsername.value,txtPassword.value);
})
btnLogin.addEventListener('click',function(){
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
win.open();

//Include api functions and variables
Titanium.include('api/login.js');

//Include additional files
Titanium.include('registration_ipad.js')
