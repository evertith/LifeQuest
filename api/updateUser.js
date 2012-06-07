function UpdateUser(){
	var xhr = Titanium.Network.createHTTPClient();
	var restData;
    xhr.setRequestHeader("content-type", "multipart/form-data");
	
	xhr.onload = function()
	{
		clearInterval(timeout);
		Ti.API.error(this.responseText);
		currentUser = JSON.parse(this.responseText);
		Ti.App.fireEvent('updateLabels')
	};
	
	// open the client
	xhr.open('GET',apiServer + apiGetUser + currentUser.email);
	
	// test service connectivity
	var timeout = setTimeout(function(){
		alert('LifeQuest web services are not responding. Please try again in a few minutes.')
		actLogin.hide();
	},serviceTimeout)
	
	// send the data
    xhr.send();    
}
