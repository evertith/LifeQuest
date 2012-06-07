function ShowBrickerbackMerchant(){
	sounds.play({sound:sounds.homeScreen.music.brickerback,isMusic:true})
	var merchantNavWin = Ti.UI.createWindow({
		width:640/2,
		height:960/2,
		bottom:-960/2,
		navBarHidden:true
	})
	
	var merchantWin = Ti.UI.createWindow({
		width:640/2,
		height:960/2,
		backgroundColor:'transparent',
		backgroundImage:imageLoc + 'brickerbackBg.png',
		top:0,
		barImage:imageLoc + 'barBg.png',
		barColor:'transparent',
	})
	var testView = Ti.UI.createView({
		width:640/2,
		height:960/2,
		backgroundColor:'transparent',
		top:0,
		layout:'horizontal'
	})
	merchantWin.add(testView);
	
	var lblTitle = Ti.UI.createLabel({
		width:'auto',
		height:'auto',
		font:{fontSize:18,fontFamily:'Big Caslon'},
		text:'The Brickerback Merchant',
		color:'#fff'
	})
	
	var btnClose = Titanium.UI.createButtonBar({
		labels:['Close'],
		style:Titanium.UI.iPhone.SystemButtonStyle.DONE,
		backgroundColor:'#000',
		width:60
	});
	
	btnClose.addEventListener('click',function(){
		var anim = Ti.UI.createAnimation();
		anim.bottom = -960/2;
		anim.duration = 400;
		merchantNavWin.animate(anim);
		anim.addEventListener('complete',function(){
			sounds.stop({sound:sounds.homeScreen.music.brickerback})
			sounds.play({sound:sounds.homeScreen.music.sound,isMusic:true})
			merchantNavWin.close();
		})
		
	})
	

	merchantWin.setLeftNavButton(btnClose);
	merchantWin.setRightNavButton(lblTitle);
	
	var merchantNav = Ti.UI.iPhone.createNavigationGroup({
		window:merchantWin,
	});
	merchantNavWin.add(merchantNav);
	
	merchantNavWin.open();
	
	var anim = Ti.UI.createAnimation();
	anim.bottom = -280/2;
	anim.duration = 400;
	merchantNavWin.animate(anim);
	
	var vertView1 = Ti.UI.createView({
		width:160/2,
		height:960/2,
		backgroundColor:'transparent',
		layout:'vertical'
	})
	var vertView2 = Ti.UI.createView({
		width:160/2,
		height:960/2,
		backgroundColor:'transparent',
		layout:'vertical'
	})
	var vertView3 = Ti.UI.createView({
		width:160/2,
		height:960/2,
		backgroundColor:'transparent',
		layout:'vertical'
	})
	var vertView4 = Ti.UI.createView({
		width:160/2,
		height:960/2,
		backgroundColor:'transparent',
		layout:'vertical'
	})
	
	var xpIcon = Ti.UI.createImageView({
		width:114/2,
		height:114/2,
		image:imageLoc + 'icon-bg.png',
		top:10,
	})

	var xpIcon1 = Ti.UI.createImageView({
		width:114/2,
		height:114/2,
		image:imageLoc + 'icon-bg.png',
	})
	var xpIcon2 = Ti.UI.createImageView({
		width:114/2,
		height:114/2,
		image:imageLoc + 'icon-bg.png',
	})
	var xpIcon3 = Ti.UI.createImageView({
		width:114/2,
		height:114/2,
		image:imageLoc + 'icon-bg.png',
	})
	var xpIcon4 = Ti.UI.createImageView({
		width:114/2,
		height:114/2,
		image:imageLoc + 'icon-bg.png',
		top:10,
	})
	var xpIcon5 = Ti.UI.createImageView({
		width:114/2,
		height:114/2,
		image:imageLoc + 'icon-bg.png',
		top:13,
	})
	var xpIcon6 = Ti.UI.createImageView({
		width:114/2,
		height:114/2,
		image:imageLoc + 'icon-bg.png',
		top:13,
	})
	var xpIcon7 = Ti.UI.createImageView({
		width:114/2,
		height:114/2,
		image:imageLoc + 'icon-bg.png',
		top:13,
	})
	var xpIcon8 = Ti.UI.createImageView({
		width:114/2,
		height:114/2,
		image:imageLoc + 'icon-bg.png',
		top:10,
	})
	var xpIcon9 = Ti.UI.createImageView({
		width:114/2,
		height:114/2,
		image:imageLoc + 'icon-bg.png',
		top:13,
	})
	var xpIcon10 = Ti.UI.createImageView({
		width:114/2,
		height:114/2,
		image:imageLoc + 'icon-bg.png',
		top:13,
	})
	var xpIcon11 = Ti.UI.createImageView({
		width:114/2,
		height:114/2,
		image:imageLoc + 'icon-bg.png',
		top:13,
	})
	var xpIcon12 = Ti.UI.createImageView({
		width:114/2,
		height:114/2,
		image:imageLoc + 'icon-bg.png',
		top:10,
	})
	var xpIcon13 = Ti.UI.createImageView({
		width:114/2,
		height:114/2,
		image:imageLoc + 'icon-bg.png',
		top:13,
	})
	var xpIcon14 = Ti.UI.createImageView({
		width:114/2,
		height:114/2,
		image:imageLoc + 'icon-bg.png',
		top:13,
	})
	var xpIcon15 = Ti.UI.createImageView({
		width:114/2,
		height:114/2,
		image:imageLoc + 'icon-bg.png',
		top:13,
	})
	
	var shadeView;
	xpIcon.addEventListener('touchstart',function(){
		shadeView = Ti.UI.createView({
			width:114/2,
			height:114/2,
			backgroundColor:'#000',
			opacity:0.5,
			type:'shadeView'
		})
		xpIcon.add(shadeView)
	})
	xpIcon.addEventListener('touchend',function(){
		xpIcon.remove(shadeView);
		ShowExperienceList();
		
	})
	xpIcon1.addEventListener('touchstart',function(){
		shadeView = Ti.UI.createView({
			width:114/2,
			height:114/2,
			backgroundColor:'#000',
			opacity:0.5,
			type:'shadeView'
		})
		xpIcon1.add(shadeView)
	})
	xpIcon1.addEventListener('touchend',function(){
		xpIcon1.remove(shadeView);
		ShowGoldList();
		
	})
	xpIcon2.addEventListener('touchstart',function(){
		shadeView = Ti.UI.createView({
			width:114/2,
			height:114/2,
			backgroundColor:'#000',
			opacity:0.5,
			type:'shadeView'
		})
		xpIcon2.add(shadeView)
	})
	xpIcon2.addEventListener('touchend',function(){
		xpIcon2.remove(shadeView);
		ShowMiniGamesList();
		
	})
	var goldIcon = Ti.UI.createImageView({
		width:99/2,
		height:99/2,
		image:imageLoc + 'icon-gold.png'
	})
	var goldLabel = Ti.UI.createLabel({
		text:'Gold',
		font:{fontSize:10,fontFamily:'Big Caslon'},
		color:'#fff'
	})
	xpIcon1.add(goldIcon);
	
	var miniGamesIcon = Ti.UI.createImageView({
		width:99/2,
		height:99/2,
		image:imageLoc + 'icon-minigames.png'
	})
	var miniGamesLevel = Ti.UI.createLabel({
		text:'Mini Games',
		font:{fontSize:10,fontFamily:'Big Caslon'},
		color:'#fff',
		bottom:0
	})
	xpIcon2.add(miniGamesIcon);


	var xpMushroom = Ti.UI.createImageView({
		width:85/2,
		height:99/2,
		image:imageLoc + 'icon-xpMushroom.png'
	})
	var xpLabel = Ti.UI.createLabel({
		text:'Experience',
		font:{fontSize:10,fontFamily:'Big Caslon'},
		color:'#fff'
	})
	xpIcon.add(xpMushroom);
	
	
	vertView1.add(xpIcon);
	vertView1.add(xpLabel);
	vertView1.add(xpIcon1);
	vertView1.add(goldLabel);
	vertView1.add(xpIcon2);
	vertView1.add(miniGamesLevel);
	vertView1.add(xpIcon3);

	vertView2.add(xpIcon4);
	vertView2.add(xpIcon5);
	vertView2.add(xpIcon6);
	vertView2.add(xpIcon7);

	vertView3.add(xpIcon8)
	vertView3.add(xpIcon9);
	vertView3.add(xpIcon10);
	vertView3.add(xpIcon11);

	vertView4.add(xpIcon12);
	vertView4.add(xpIcon13);
	vertView4.add(xpIcon14);
	vertView4.add(xpIcon15);

	testView.add(vertView1);
	testView.add(vertView2);
	testView.add(vertView3);
	testView.add(vertView4);
	
	function ShowExperienceList(){
		var secondWin = Ti.UI.createWindow({
			width:640/2,
			height:960/2,
			backgroundColor:'transparent',
			backgroundImage:imageLoc + 'brickerbackBg.png',
			top:0,
			barImage:imageLoc + 'barBg.png',
			barColor:'transparent',
			title:'Experience',
		})
		merchantNav.open(secondWin);
		
		var scrollView = Ti.UI.createScrollView({
			width:640/2,
			height:595/2,
			contentWidth:640/2,
			contentHeight:'auto',
			top:44,
			layout:'vertical'
		})
		
		secondWin.add(scrollView);
		
		CreateItem('icon-xpMushroom.png', '10,000 Experience', 'com.tigerdog.lifequest.xp.10000',1250,'$0.99',scrollView,false,'xp',10000);
		CreateItem('icon-xpMushroom.png', '50,000 Experience', 'com.tigerdog.lifequest.xp.50000',1500,'$1.99',scrollView,false,'xp',50000);
		CreateItem('icon-xpMushroom.png', '100,000 Experience', 'com.tigerdog.lifequest.xp.100000',1750,'$2.99',scrollView,false,'xp',100000);
		CreateItem('icon-xpMushroom.png', '150,000 Experience', 'com.tigerdog.lifequest.xp.150000',2000,'$3.99',scrollView,false,'xp',150000);
		CreateItem('icon-xpMushroom.png', '250,000 Experience', 'com.tigerdog.lifequest.xp.250000',2500,'$4.99',scrollView,false,'xp',250000);
		CreateItem('icon-xpMushroom.png', '500,000 Experience', 'com.tigerdog.lifequest.xp.500000',3000,'$5.99',scrollView,false,'xp',500000);
		CreateItem('icon-xpMushroom.png', '750,000 Experience', 'com.tigerdog.lifequest.xp.750000',3500,'$6.99',scrollView,false,'xp',750000);
		CreateItem('icon-xpMushroom.png', '1,000,000 Experience', 'com.tigerdog.lifequest.xp.1000000',4000,'$7.99',scrollView,false,'xp',1000000);
		CreateItem('icon-xpMushroom.png', '1,500,000 Experience', 'com.tigerdog.lifequest.xp.1500000',5000,'$8.99',scrollView,false,'xp',1500000);
		CreateItem('icon-xpMushroom.png', '2,500,000 Experience', 'com.tigerdog.lifequest.xp.2500000',6000,'$9.99',scrollView,false,'xp',2500000);
		CreateItem('icon-xpMushroom.png', '5,000,000 Experience', 'com.tigerdog.lifequest.xp.5000000',8500,'$10.99',scrollView,false,'xp',5000000);
		
	}
	
	function ShowGoldList(){
		var secondWin = Ti.UI.createWindow({
			width:640/2,
			height:960/2,
			backgroundColor:'transparent',
			backgroundImage:imageLoc + 'brickerbackBg.png',
			top:0,
			barImage:imageLoc + 'barBg.png',
			barColor:'transparent',
			title:'Gold',
		})
		merchantNav.open(secondWin);
		
		var scrollView = Ti.UI.createScrollView({
			width:640/2,
			height:595/2,
			contentWidth:640/2,
			contentHeight:'auto',
			top:44,
			layout:'vertical'
		})
		
		secondWin.add(scrollView);
		
		CreateItem('icon-gold.png', '250 Gold', 'com.tigerdog.lifequest.gold.250',250,'$0.99',scrollView,true,'gold');
		CreateItem('icon-gold.png', '500 Gold', 'com.tigerdog.lifequest.gold.500',500,'$1.99',scrollView,true,'gold');
		CreateItem('icon-gold.png', '750 Gold', 'com.tigerdog.lifequest.gold.750',750,'$2.99',scrollView,true,'gold');
		CreateItem('icon-gold.png', '1,000 Gold', 'com.tigerdog.lifequest.gold.1000',1000,'$3.99',scrollView,true,'gold');
		CreateItem('icon-gold.png', '1,500 Gold', 'com.tigerdog.lifequest.gold.1500',1500,'$4.99',scrollView,true,'gold');
		CreateItem('icon-gold.png', '2,000 Gold', 'com.tigerdog.lifequest.gold.2000',2000,'$5.99',scrollView,true,'gold');
		CreateItem('icon-gold.png', '2,500 Gold', 'com.tigerdog.lifequest.gold.2500',2500,'$6.99',scrollView,true,'gold');
		CreateItem('icon-gold.png', '3,000 Gold', 'com.tigerdog.lifequest.gold.3000',3000,'$7.99',scrollView,true,'gold');
		CreateItem('icon-gold.png', '4,000 Gold', 'com.tigerdog.lifequest.gold.4000',4000,'$8.99',scrollView,true,'gold');
		CreateItem('icon-gold.png', '5,000 Gold', 'com.tigerdog.lifequest.gold.5000',5000,'$9.99',scrollView,true,'gold');
		CreateItem('icon-gold.png', '7,500 Gold', 'com.tigerdog.lifequest.gold.7500',7500,'$10.99',scrollView,true,'gold');
		
	}

	function ShowMiniGamesList(){
		var secondWin = Ti.UI.createWindow({
			width:640/2,
			height:960/2,
			backgroundColor:'transparent',
			backgroundImage:imageLoc + 'brickerbackBg.png',
			top:0,
			barImage:imageLoc + 'barBg.png',
			barColor:'transparent',
			title:'Mini Games',
		})
		merchantNav.open(secondWin);
		
		var scrollView = Ti.UI.createScrollView({
			width:640/2,
			height:595/2,
			contentWidth:640/2,
			contentHeight:'auto',
			top:44,
			layout:'vertical'
		})
		
		secondWin.add(scrollView);
		
		CreateItem('icon-minigames.png', 'Mini Game Pack 1', 'com.tigerdog.lifequest.minigame.pack1',1000,'$0.99',scrollView,false,'minigame');
		CreateItem('icon-minigames.png', 'Mini Game Pack 2', 'com.tigerdog.lifequest.minigame.pack2',1000,'$0.99',scrollView,false,'minigame');
		CreateItem('icon-minigames.png', 'Mini Game Pack 3', 'com.tigerdog.lifequest.minigame.pack3',1000,'$0.99',scrollView,false,'minigame');
		CreateItem('icon-minigames.png', 'Mini Game Pack 4', 'com.tigerdog.lifequest.minigame.pack4',1000,'$0.99',scrollView,false,'minigame');
		
	}
	function CreateItem(icon,title,inAppName,goldAmount,priceAmount,scrollviewToAdd,goldOnly,type,xpAmount){
		
		var backgroundForItem = Ti.UI.createView({
			width:607/2,
			height:122/2,
			backgroundImage:imageLoc + 'merchantItemBg.png'
		})
		
		var icon = Ti.UI.createImageView({
			width:100/2,
			height:100/2,
			image:imageLoc + icon,
			left:5
		})
		
		var labelForItem = Ti.UI.createLabel({
			width:'auto',
			height:'auto',
			text:title,
			font:{fontSize:16,fontFamily:'Big Caslon'},
			color:'#fff',
			left:65
		})
		
		var btnPurchase = Titanium.UI.createButtonBar({
			labels:[priceAmount],
			style:Titanium.UI.iPhone.SystemButtonStyle.DONE,
			backgroundColor:'#29d221',
			width:70,
			height:25,
			right:7,
		});
		var btnPurchaseGold = Titanium.UI.createButtonBar({
			labels:[goldAmount + ' Gold'],
			style:Titanium.UI.iPhone.SystemButtonStyle.DONE,
			backgroundColor:'#c0ba12',
			width:70,
			height:25,
			right:7,
			bottom:7,
			color:'#000'
		});
		
		btnPurchase.addEventListener('click',function(e){
			requestProduct(inAppName, function (product) {
				purchaseProduct(product,{type:type,gold:goldAmount,xpAmount:xpAmount});
			});
			
		})	
		btnPurchaseGold.addEventListener('click',function(e){
			if((parseInt(currentUser.gold) - goldAmount) >= 0){
				var newGold = parseInt(currentUser.gold) - goldAmount;
	       		switch(type){
	        		case 'xp':
	        			Ti.App.fireEvent('showAchievement',{group:'Loots',title:'First Experience Purchase',desc:'You\'re a rockstar!',points:10})
            			socketUser.emit('updateXp',{email:currentUser.email,userXp:currentUser.xp,xpAmount:xpAmount,level:currentUser.level})
	        			socketInApp.emit('purchaseGold',{email:currentUser.email,gold:newGold})
	        			break;
	        	}
	        } else {
	        	alert('You don\'t have enough gold to purchase this item.');
	        }			
		})	
		
		backgroundForItem.add(icon);
		backgroundForItem.add(labelForItem);
		backgroundForItem.add(btnPurchase);
		if(!goldOnly){
			btnPurchase.top = 3;
			backgroundForItem.add(btnPurchaseGold);
		}

		
		
		
		scrollviewToAdd.add(backgroundForItem);
	}

}
