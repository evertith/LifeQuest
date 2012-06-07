function Login(email,pass,showAchievement){
	var xhr = Titanium.Network.createHTTPClient();
	var restData;
    xhr.setRequestHeader("content-type", "multipart/form-data");
	
	xhr.onload = function()
	{
		Ti.API.error('are we there  yet?')
		clearInterval(timeout);
		Ti.API.error(this.responseText);
		if(this.responseText.indexOf('{') != -1){
			restData = JSON.parse(this.responseText);
			Ti.API.error(this.responseText);
			if(restData.email){
	            Ti.App.fireEvent('loggedIn',restData);
	            if(showAchievement){
					Ti.App.fireEvent('showAchievement',{group:'General',title:'New Account Created',desc:'Congrats on your new account!',points:10})
				}
			} else {
	            var a = Titanium.UI.createAlertDialog({
	                title:'Incorrect Email/Password',
	                message:'Your email and/or password were incorrect. Please try again.'
	            });
	            a.show();
	            actLogin.hide();
			}
		} else {
            var a = Titanium.UI.createAlertDialog({
                title:'Unknown error',
                message:this.responseText
            });
            a.show();
            actLogin.hide();
		}
	};
	
	// open the client
	xhr.open('POST',apiServer + apiLogin);
	
	// test service connectivity
	var timeout = setTimeout(function(){
		alert('LifeQuest web services are not responding. Please try again in a few minutes.')
		actLogin.hide();
	},serviceTimeout)
	
	// send the data
    var params = {
      email: email.toLowerCase(),
      pass: pass
    };
    xhr.send(params);    
}
