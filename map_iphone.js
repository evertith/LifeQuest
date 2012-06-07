function ShowMap(){
	var mapview = Titanium.Map.createView({
		region:{latitude:latitude, longitude:longitude, latitudeDelta:0.0009, longitudeDelta:0.0009},
		animate:true,
		regionFit:true,
		userLocation:true,
		mapType:Titanium.Map.SATELLITE_TYPE,
		width:2000,
		height:2000,
		annotations:[]
	});
		
	var userInfo = Ti.UI.createLabel({
		width:'auto',
		height:'auto',
		top:10,
		font:{fontSize:24,fontWeight:'bold'},
		color:'#ff0000',
		opacity:0
	})
	
	mapLatitude = latitude;
	mapLongitude = longitude;
	
	mapview.addEventListener('regionChanged',function(e){
		mapLatitude = e.latitude;
		mapLongitude = e.longitude;
		socketNodes.emit('server_nodes',{lat:e.latitude,lng:e.longitude});
		//GetNodes({latitude:e.latitude,longitude:e.longitude},mapview)
	})
	
	mapview.addEventListener('click',function(evt){
		// map event properties
		var annotation = evt.annotation;
		var title = annotation.title;
		var type = annotation.type;
		var maintype = annotation.maintype;
		var id = annotation.id;
		var clicksource = evt.clicksource;
		var item_id = annotation.item_id;
		var data = annotation.data;
	
		if (evt.clicksource == 'rightButton')
		{
			var coords = {latitude:annotation.latitude,longitude:annotation.longitude}
			var distance = 0.00009;
			var latAmount = annotation.latitude - latitude;
			var lngAmount = annotation.longitude - longitude;
			
			if(type == 'treasure'){
				if(latAmount < distance && latAmount > (distance-(distance*2)) && (lngAmount < distance && lngAmount > (distance-(distance*2)))){
					ShowLoot(data,coords);
					mapview.removeAnnotation(annotation);
					Ti.App.fireEvent('showAchievement',{group:'Loots',title:'Loot is Our Friend',desc:'Loot your node on the map.',points:10})
				} else {
					alert('You need to be closer to loot this treasure chest.')
				}
			} else if(type ==  'enemy'){
				FightEnemy(annotation);
			} else {
				ShowLoot(data,coords);
				mapview.removeAnnotation(annotation);
				Ti.App.fireEvent('showAchievement',{group:'Loots',title:'Loot is Our Friend',desc:'Loot your node on the map.',points:10})
			}
		}
	})

	socketNodes.on('client_nodes',function(data){
		var nodes = [];
		for(var i=0;i<data.length;i++){
			Ti.API.warn(data[i].lootDateTime)
			var nodeImage = Ti.UI.createImageView({
				width:35,
				height:35,
				image:imageLoc + data[i].leftImage
			})
			var mapImage = data[i].image;
			if(at2x == '@2x'){
				
			}
			var tempAnnotation = Titanium.Map.createAnnotation({
				latitude:data[i].lat,
				longitude:data[i].lng,
				title:data[i].name,
				leftView:nodeImage,
				subtitle:data[i].subtitle,
				image:imageLoc + data[i].image,
				type:data[i].type,
				animate:false,
				rightButton:imageLoc + 'icon-loot.35.png',
				id:data[i]._id,
				remove:true,
				data:data[i]
			})
			if(data[i].type == 'enemy'){
				tempAnnotation.rightButton = imageLoc + data[i].rightImage;
			}
			nodes.push(tempAnnotation);
		}
		mapview.setAnnotations(nodes);
	})			
	/*mapview.addEventListener('nodesFound',function(e){
		var nodes = [];
		for(var i=0;i<e.data.length;i++){
			var nodeImage = Ti.UI.createImageView({
				width:35,
				height:35,
				image:imageLoc + e.data[i].leftImage
			})
			var tempAnnotation = Titanium.Map.createAnnotation({
				latitude:e.data[i].lat,
				longitude:e.data[i].lng,
				title:e.data[i].name,
				leftView:nodeImage,
				subtitle:e.data[i].subtitle,
				image:imageLoc + e.data[i].image,
				type:e.data[i].type,
				animate:false,
				rightButton:imageLoc + 'icon-loot.35.png',
				id:e.data[i]._id,
				remove:true,
				data:e.data[i]
			})
			nodes.push(tempAnnotation);
		}
		mapview.setAnnotations(nodes);
	});
	*/
	
	var win = Ti.UI.createWindow({
		width:640/2,
		height:960/2,
	})
	
	socketNodes.emit('server_nodes',{lat:latitude,lng:longitude});
	//GetNodes({latitude:latitude,longitude:longitude},mapview)

	var iconBase = Ti.UI.createView({
		width:640/2,
		height:100/2,
		bottom:-100,
	})
	
	var iconClose = Ti.UI.createImageView({
		width:67/2,
		height:70/2,
		image:imageLoc + 'icon-close.png',
		right:1,
		bottom:1
	})
	iconClose.addEventListener('click',function(){
		var iconBase2Anim = Ti.UI.createAnimation();
		iconBase2Anim.bottom = -100;
		iconBase2Anim.duration = 400;
		iconBase.animate(iconBase2Anim);
		var exploreAnim = Ti.UI.createAnimation();
		exploreAnim.bottom = 0;
		exploreAnim.duration = 400;
		exploreText.animate(exploreAnim);
		nav.close(win)
	})
	
	iconBase.add(iconClose);
	
	var iconBaseAnim = Ti.UI.createAnimation();
	iconBaseAnim.bottom = 0;
	iconBaseAnim.duration = 400;
	iconBase.animate(iconBaseAnim);
	
	var lblAccuracy = Ti.UI.createLabel({
		width:'auto',
		height:'auto',
		text:accuracy,
		font:{fontSize:18,fontWeight:'bold'},
		color:'#ff0000',
		top:2,
		left:2
	})
	var lblLat = Ti.UI.createLabel({
		width:'auto',
		height:'auto',
		text:latitude,
		font:{fontSize:18,fontWeight:'bold'},
		color:'#ff0000',
		top:20,
		left:2
	})
	var lblLng = Ti.UI.createLabel({
		width:'auto',
		height:'auto',
		text:longitude,
		font:{fontSize:18,fontWeight:'bold'},
		color:'#ff0000',
		top:40,
		left:2
	})
	var lblSpeed = Ti.UI.createLabel({
		width:'auto',
		height:'auto',
		text:speed,
		font:{fontSize:18,fontWeight:'bold'},
		color:'#ff0000',
		top:60,
		left:2
	})
	win.add(mapview);
	win.add(userInfo);
	win.add(lblAccuracy);
	win.add(lblLat);
	win.add(lblLng);
	win.add(lblSpeed);
	navWin.add(iconBase);
	nav.open(win);
	//win.open();
	
	//socketNodes.emit('server_nodes',{lat:latitude,lng:longitude});
	//socketNodes.emit('server_userloc',{email:currentUser.email,lat:latitude,lng:longitude});

	var geoCallback = function(a){
		if (!a.success || a.error)
		{
			Ti.API.error(a.error);
		} else {
			longitude = a.coords.longitude;
			latitude = a.coords.latitude;
			speed = a.coords.speed;
			accuracy = a.coords.accuracy;
			lblAccuracy.text = accuracy;
			lblLat.text = latitude;
			lblLng.text = longitude;
			lblSpeed.text = speed*2;
			Ti.App.Properties.setDouble('actiondistanceamount',0.00001*accuracy)
			
			if(((latitude - oldLat > 0.0001 || latitude - oldLat < -0.0001) || (longitude - oldLng > 0.0001 || longitude - oldLng < -0.0001)) && speed < 6){
				socketUser.emit('updateXp',{level:currentUser.level,email:currentUser.email,userXp:currentUser.xp,xpAmount:10})
				socketNodes.emit('server_nodes',{lat:latitude,lng:longitude});
				//GetNodes({latitude:latitude,longitude:longitude},mapview)
				oldLat = latitude;
				oldLng = longitude;
			} 


			if(speed > 5){
				lblSpeed.text = speed + ' - You are too fast'
			}
			
		}
	}
	Ti.Geolocation.addEventListener('location', geoCallback)
	
	function ShowLoot(lootData,annotationCoords){
		socketItems.emit('setNodeDate',{nodeData:lootData});
		var randomNumber = 1 + Math.round(Math.random()*parseInt(distance(latitude,longitude,annotationCoords.latitude,annotationCoords.longitude)/.01));
		var xpAmount = 0;
		
		if(randomNumber == 1 || randomNumber == 2){
			xpAmount = 100;
		} else if(lootData.type == 'treasure'){
			xpAmount = 500;
		} else {
			xpAmount = 5;
		}
		
		socketUser.emit('updateXp',{level:currentUser.level,email:currentUser.email,userXp:currentUser.xp,xpAmount:xpAmount})
		ShowExperienceWin({experienceAmount:xpAmount})
		
		var blackoutView = Ti.UI.createView({
			width:640/2,
			height:960/2,
			backgroundColor:'#000',
			opacity:0,
			zIndex:1
		})
		var containerView = Ti.UI.createView({
			width:640/2,
			height:960/2,
			backgroundColor:'transparent',
			opacity:0,
			zIndex:2
		})
		win.add(blackoutView);
		win.add(containerView);
		
		var blackoutViewAnim = Ti.UI.createAnimation();
		blackoutViewAnim.opacity = 0.7;
		blackoutViewAnim.duration = 400;
		blackoutView.animate(blackoutViewAnim);

		var containerViewAnim = Ti.UI.createAnimation();
		containerViewAnim.opacity = 1;
		containerViewAnim.duration = 400;
		containerView.animate(containerViewAnim);

		blackoutViewAnim.addEventListener('complete',function(){
			var lootWin = Ti.UI.createView({
				width:392/2,
				height:568/2,
				backgroundImage:imageLoc + 'lootWindowBG.png',
				top:-568/2
			})
			var lootWinClose = Ti.UI.createButton({
				width:77/2,
				height:79/2,
				backgroundImage:imageLoc + 'lootWindowClose.png',
				backgroundSelectedImage:imageLoc + 'lootWindowClose.png',
				top:0,
				right:0
			})
			var lootWinImage = Ti.UI.createImageView({
				width:75/2,
				height:75/2,
				image:imageLoc + lootData.leftImage,
				left:20/2,
				top:20/2
			})
			var lootWinLabel = Ti.UI.createLabel({
				width:'auto',
				height:'auto',
				text:lootData.name,
				font:{fontSize:14,fontWeight:'bold',fontFamily:'Big Caslon'},
				color:'#d16060',
				top:20/2,
				left:100/2
			})
			
			var lootScrollView = Ti.UI.createScrollView({
				width:375/2,
				height:550/2,
				backgroundColor:'transparent',
				contentWidth:375/2,
				contentHeight:'auto',
				layout:'vertical',
				top:100/2,
				opacity:1
			})
			
			var itemGold = Ti.UI.createView({
				width:348/2,
				height:102/2,
				backgroundImage:imageLoc + 'lootItemBG.png'
			})
			var itemGoldText = Ti.UI.createLabel({
				width:'auto',
				height:'auto',
				font:{fontSize:18,fontWeight:'bold',fontFamily:'Big Caslon'},
				text:lootData.currency[0].amount + ' gold',
				color:'#999',
				touchEnabled:false
			})
			
			itemGold.add(itemGoldText);
			itemGold.addEventListener('click',function(e){
				//UpdateLoot({email:currentUser.email,type:'currency',gold:parseInt(currentUser.gold) + parseInt(lootData.currency[0].amount),silver:currentUser.silver},lootScrollView,e.source);
				socketItems.emit('lootUpdate',{email:currentUser.email,type:'currency',gold:parseInt(currentUser.gold) + parseInt(lootData.currency[0].amount),silver:currentUser.silver,nodeData:lootData})
				socketItems.on('lootUpdated',function(data){
					lootScrollView.remove(e.source);
				})	
			})
			
			var itemSilver = Ti.UI.createView({
				width:348/2,
				height:102/2,
				backgroundImage:imageLoc + 'lootItemBG.png'
			})
			var itemSilverText = Ti.UI.createLabel({
				width:'auto',
				height:'auto',
				font:{fontSize:18,fontWeight:'bold',fontFamily:'Big Caslon'},
				text:lootData.currency[1].amount + ' silver',
				color:'#999',
				touchEnabled:false
			})
			
			itemSilver.add(itemSilverText);
			itemSilver.addEventListener('click',function(e){
				//UpdateLoot({email:currentUser.email,type:'currency',gold:currentUser.gold,silver:parseInt(currentUser.silver) + parseInt(lootData.currency[1].amount)},lootScrollView,e.source);
				socketItems.emit('lootUpdate',{email:currentUser.email,type:'currency',gold:currentUser.gold,silver:parseInt(currentUser.silver) + parseInt(lootData.currency[1].amount),nodeData:lootData})
				socketItems.on('lootUpdated',function(data){
					//UpdateUser()
					lootScrollView.remove(e.source);
				})	
			})


			Ti.API.error(lootData.type + ' - ' + randomNumber);
			if(randomNumber == 1 || randomNumber == 2){
				AddLoots();
			} else if(lootData.type == 'treasure'){
				AddLoots();
			}
			
			function AddLoots(){
				if(parseInt(lootData.currency[0].amount) > 0){
					lootScrollView.add(itemGold);
				}
				if(parseInt(lootData.currency[1].amount) > 0){
					lootScrollView.add(itemSilver);
				}
			}
			
			lootWinClose.addEventListener('click',function(){
				var blackoutViewCloseAnim = Ti.UI.createAnimation();
				blackoutViewCloseAnim.opacity = 0;
				blackoutViewCloseAnim.duration = 400;
				blackoutView.animate(blackoutViewCloseAnim);
				containerView.animate(blackoutViewCloseAnim);

				blackoutViewCloseAnim.addEventListener('complete',function(){
					win.remove(blackoutView);
					win.remove(containerView);
				})
			})	
			
			lootWin.add(lootWinClose);
			lootWin.add(lootWinImage);
			lootWin.add(lootWinLabel);
			lootWin.add(lootScrollView);
			
			containerView.add(lootWin);
			
			lootWinAnim = Ti.UI.createAnimation();
			lootWinAnim.top = 250/2;
			lootWinAnim.duration = 400;
			lootWin.animate(lootWinAnim);
			lootWinAnim.addEventListener('complete',function(){
				//alert(JSON.stringify(lootData))
			})
			
		})
		
	}

}
