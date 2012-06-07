function Registration(){
	sounds.play({sound:sounds.registrationScreen.music.sound,isMusic:true})
	//Setup items
	var win = Ti.UI.createWindow({
		width:640/2,
		height:960/2,
		backgroundImage:imageLoc + 'mainBg.jpg',
		navBarHidden:true
	})
	
	var imgLogo = Ti.UI.createImageView({
		width:630/2,
		height:206/2,
		image:imageLoc + 'registerLogo.png',
		top:10/2,
	})
	
	var btnRegister = Ti.UI.createButton({
		width:536/2,
		height:109/2,
		backgroundImage:imageLoc + 'btnRegister.png',
		backgroundSelectedImage:imageLoc + 'btnRegister.png',
		bottom:60/2
	})
	
	var btnCancel = Ti.UI.createButton({
		width:536/2,
		height:88/2,
		backgroundImage:imageLoc + 'btnRegisterCancel.png',
		backgroundSelectedImage:imageLoc + 'btnRegisterCancel.png',
		bottom:0
	})
	
	var vwEmail = Ti.UI.createView({
		width:536/2,
		height:109/2,
		backgroundImage:imageLoc + 'txtRegisterBg.png',
		top:200/2
	})
	var txtEmail = Ti.UI.createTextField({
		width:480/2,
		height:75/2,
		color:'#fff',
		hintText:'Email',
		font:{fontSize:18,fontFamily:'Big Caslon'},
		backgroundColor:'transparent',
		keyboardType:Ti.UI.KEYBOARD_EMAIL,
		top:0,
		returnKeyType:Ti.UI.RETURNKEY_NEXT
	})
	
	var vwPassword = Ti.UI.createView({
		width:536/2,
		height:109/2,
		backgroundImage:imageLoc + 'txtRegisterBg.png',
		top:300/2
	})
	var txtPassword = Ti.UI.createTextField({
		width:480/2,
		height:75/2,
		color:'#fff',
		hintText:'Password',
		font:{fontSize:18,fontFamily:'Big Caslon'},
		backgroundColor:'transparent',
		top:0,
		passwordMask:true,
		returnKeyType:Ti.UI.RETURNKEY_NEXT
	})
	
	var vwNickname = Ti.UI.createView({
		width:536/2,
		height:109/2,
		backgroundImage:imageLoc + 'txtRegisterBg.png',
		top:400/2
	})
	var txtNickname = Ti.UI.createTextField({
		width:480/2,
		height:75/2,
		color:'#fff',
		hintText:'Nickname',
		font:{fontSize:18,fontFamily:'Big Caslon'},
		backgroundColor:'transparent',
		top:0,
	})
	
	var boxAvatar = Ti.UI.createView({
		width:312/2,
		height:336/2,
		backgroundImage:imageLoc + 'boxAvatar.png',
		bottom:150/2
	})
	var avatar1 = Ti.UI.createView({
		width:256/2,
		height:256/2,
		backgroundImage:imageLoc + 'avatars/monsters/slimer.png',
		imageFolder:'avatars/monsters/slimer.png'
	})
	var avatar2 = Ti.UI.createView({
		width:256/2,
		height:256/2,
		backgroundImage:imageLoc + 'avatars/funny/tux.png',
		imageFolder:'avatars/funny/tux.png'
	})
	var avatar3 = Ti.UI.createView({
		width:256/2,
		height:256/2,
		backgroundImage:imageLoc + 'avatars/funny/penguin391.png',
		imageFolder:'avatars/funny/penguin391.png'
	})
	var avatar4 = Ti.UI.createView({
		width:256/2,
		height:256/2,
		backgroundImage:imageLoc + 'avatars/funny/penguin392.png',
		imageFolder:'avatars/funny/penguin392.png'
	})
	var avatar5 = Ti.UI.createView({
		width:256/2,
		height:256/2,
		backgroundImage:imageLoc + 'avatars/funny/penguin393.png',
		imageFolder:'avatars/funny/penguin393.png'
	})
	var svAvatar = Titanium.UI.createScrollableView({
		views:[avatar1,avatar2,avatar3,avatar4,avatar5],
		showPagingControl:false,
		maxZoomScale:1.0,
		currentPage:0,
		width:260/2,
		height:256/2,
		contentWidth:'auto',
		contentHeight:290/2,
		top:-5/2,
	});

	//Add Event listeners
	btnRegister.addEventListener('click',function(){
		var data = {
			email:txtEmail.value,
			password:txtPassword.value,
			nickname:txtNickname.value,
			avatar:svAvatar.views[svAvatar.currentPage].imageFolder,
			lat:latitude,
			lng:longitude
		}
		Register(data,win);
		//socketUser.emit('server_register',data);
	})
	btnCancel.addEventListener('click',function(){
		sounds.stop({sound:sounds.registrationScreen.music.sound})
		sounds.play({sound:sounds.titleScreen.music.sound,isMusic:true})
		win.close();
	})
	txtEmail.addEventListener('return',function(){
		txtPassword.focus();
	})
	txtPassword.addEventListener('return',function(){
		txtNickname.focus();
	})

	//Add items to items
	vwEmail.add(txtEmail);
	vwPassword.add(txtPassword);
	vwNickname.add(txtNickname);
	
	boxAvatar.add(svAvatar)
	
	win.add(imgLogo);
	win.add(btnRegister);
	win.add(btnCancel);
	win.add(vwEmail);
	win.add(vwPassword);
	win.add(vwNickname);
	win.add(boxAvatar);

	//Open Window
	win.open({modal:true})

}
