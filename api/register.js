function Register(data,win){
	var xhr = Titanium.Network.createHTTPClient();
	var restData;
    xhr.setRequestHeader("content-type", "multipart/form-data");
	
	xhr.onload = function()
	{
		Ti.API.error('are we there  yet?')
		clearInterval(timeout);
		Ti.API.error(this.responseText);
		var responseText = JSON.parse(this.responseText);
		
		if(responseText.code = 1){
			clearInterval(timeout);
			currentUser = responseText.data;
			actLogin.hide();
			win.close();
			Login(data.email.toLowerCase(),data.password,true)
		} else {
            var a = Titanium.UI.createAlertDialog({
                title:'Registration Error',
                message:'There was an error registering your new account: ' + this.responseText
            });
            a.show();
            actLogin.hide();
		}
	};
	
	// open the client
	xhr.open('POST',apiServer + apiRegister);
	
	// test service connectivity
	var timeout = setTimeout(function(){
		alert('LifeQuest web services are not responding. Please try again in a few minutes.')
		actLogin.hide();
	},serviceTimeout)
	
	// send the data
    var params = {
      email: data.email.toLowerCase(),
      password: data.password,
      nickname:data.nickname,
      avatar:data.avatar,
      lat:data.lat,
      lng:data.lng,
      homeLat:data.lat,
      homeLng:data.lng,
      remoteLat:data.lat,
      remoteLng:data.lng
    };
    xhr.send(params);    
}
