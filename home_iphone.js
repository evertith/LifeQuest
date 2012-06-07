function ShowHome(){
	sounds.play({sound:sounds.homeScreen.music.sound,isMusic:true})

	var achPoints = 0;
	for(var i=0;i<currentUser.achievements.length;i++){
		achPoints += parseInt(currentUser.achievements[i].points)
	}
	var win = Ti.UI.createWindow({
		width:640/2,
		height:960/2,
		backgroundImage:imageLoc + 'accountBg.jpg'
	})
	
	var border = Ti.UI.createView({
		width:640/2,
		height:589/2,
		backgroundImage:imageLoc + 'accountBorder.png',
		top:0,
		touchEnabled:false
	})
	
	var lblNickname = Ti.UI.createLabel({
		width:'auto',
		height:'auto',
		text:currentUser.nickname,
		font:{fontSize:20,fontFamily:'Big Caslon'},
		top:4/2,
		left:4/2,
		color:'#fff'
	})
	
	var lblLevel = Ti.UI.createLabel({
		width:'auto',
		height:'auto',
		text:'Level ' + currentUser.level,
		font:{fontSize:16,fontFamily:'Big Caslon'},
		top:40/2,
		left:8/2,
		color:'#ad534f'
	})
	
	var vwMoney = Ti.UI.createView({
		width:500/2,
		height:100/2,
		layout:'horizontal',
		top:0,
		left:200/2
	})
	
	var imgGoldIcon = Ti.UI.createImageView({
		width:33/2,
		height:33/2,
		image:imageLoc + 'icon-gold.png',
		top:2
	})
	
	var lblGoldAmount = Ti.UI.createLabel({
		width:'auto',
		height:'auto',
		text:currentUser.gold,
		font:{fontSize:15,fontFamily:'Big Caslon'},
		left:8/2,
		color:'#fff',
		top:0
	})
	
	var imgSilverIcon = Ti.UI.createImageView({
		width:33/2,
		height:33/2,
		image:imageLoc + 'icon-silver.png',
		left:10/2,
		top:2
	})
	
	var lblSilverAmount = Ti.UI.createLabel({
		width:'auto',
		height:'auto',
		text:currentUser.silver,
		font:{fontSize:15,fontFamily:'Big Caslon'},
		left:8/2,
		color:'#fff',
		top:2
	})
	
	var imgAchIcon = Ti.UI.createImageView({
		width:31/2,
		height:31/2,
		image:imageLoc + 'icon-achMedal.png',
		top:40/2,
		left:200/2
	})
	
	var lblAchPoints = Ti.UI.createLabel({
		width:'auto',
		height:'auto',
		text:achPoints,
		font:{fontSize:15,fontFamily:'Big Caslon'},
		left:240/2,
		top:40/2,
		color:'#a09724'
	})
	
	var imgAvatar = Ti.UI.createImageView({
		width:175/2,
		height:175/2,
		image:imageLoc + currentUser.avatar,
		right:2/2,
		top:2/2
	})
	
	var imgFolder = Ti.UI.createImageView({
		width:271/2,
		height:170/2,
		image:imageLoc + 'icon-awards.png',
		left:110
	})
	imgFolder.addEventListener('click',function(){
		var item = {
			icon:'test.png',
			name:'Test Item',
			rarity:0,
			type:'Flower',
			slot:'none',
			itemLevel:1,
			vendorCost:{gold:0,silver:50},
			vendorSell:{gold:0,silver:1},
			equippable:false,
			equipped:false,
			inVault:false,
			questItem:false,
			bossItem:false,
			bossID:-1,
			strength:0,
			defense:0,
			description:'This is a test flower.'
		}
		NewItem(item);
	})
	var imgFolder2 = Ti.UI.createImageView({
		width:178/2,
		height:175/2,
		image:imageLoc + 'icon-arcade.png',
		left:40
	})
	imgFolder2.addEventListener('click',function(){
		ShowGreeneSteelArcade();
	});
	var imgFolder3 = Ti.UI.createImageView({
		width:238/2,
		height:171/2,
		image:imageLoc + 'icon-brickerback.png',
		left:40
	})
	imgFolder3.addEventListener('click',function(){
		sounds.stop({sound:sounds.homeScreen.music.sound})
		Ti.App.Properties.setBool('Purchased-com.tigerdog.lifequest.minigame.pack1', false);
		Ti.API.info('Purchase has been reset')
		//restorePurchases();
		ShowBrickerbackMerchant();
	})
	var imgFolder4 = Ti.UI.createImageView({
		width:166/2,
		height:179/2,
		image:imageLoc + 'icon-epics.png',
		left:40
	})
	imgFolder4.addEventListener('click',function(){

	})
	var imgFolder5 = Ti.UI.createImageView({
		width:271/2,
		height:179/2,
		image:imageLoc + 'bankOfDafflemore.png',
		left:40
	})
	imgFolder5.addEventListener('click',function(){

	})
	
	var vwSections = Ti.UI.createScrollView({
		showPagingControl:false,
		maxZoomScale:1.0,
		currentPage:0,
		width:690/2,
		height:196/2,
		contentWidth:980,
		contentHeight:196/2,
		top:150/2,
		layout:'horizontal',
		left:-20
	})
	
	vwSections.add(imgFolder);
	vwSections.add(imgFolder2);
	vwSections.add(imgFolder3);
	vwSections.add(imgFolder4);
	vwSections.add(imgFolder5);
	
	vwMoney.add(imgGoldIcon);
	vwMoney.add(lblGoldAmount);
	vwMoney.add(imgSilverIcon);
	vwMoney.add(lblSilverAmount);
	
	border.add(lblNickname);
	border.add(lblLevel);
	border.add(vwMoney);
	border.add(imgAchIcon);
	border.add(lblAchPoints);
	border.add(imgAvatar);
	
	win.add(vwSections);
	win.add(border);
	
	nav.open(win);
	
	Ti.App.addEventListener('updateLabels',function(e){
	})
	socketUser.on('updateUser',function(data){
		currentUser = data;
		lblSilverAmount.text = currentUser.silver;
		lblGoldAmount.text = currentUser.gold;
		lblLevel.text = 'Level ' + currentUser.level;
		for(var i=0;i<currentUser.achievements.length;i++){
			lblAchPoints.text = parseInt(currentUser.achievements[i].points)
		}
		Ti.API.error(currentUser.xp)
	})

	socketUser.on('gainedNewLevel',function(data){
		alert('New Level! You are now level ' + data.level)
	})
}
