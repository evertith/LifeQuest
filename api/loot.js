function UpdateLoot(lootData,scrollView,source){
	var xhr = Titanium.Network.createHTTPClient();
	var restData;
    xhr.setRequestHeader("content-type", "multipart/form-data");
	
	xhr.onload = function()
	{
		clearInterval(timeout);
		Ti.API.error(this.responseText);
		UpdateUser()
		scrollView.remove(source);
	};
	
	// open the client
	xhr.open('POST',apiServer + apiUpdateLoot);
	
	// test service connectivity
	var timeout = setTimeout(function(){
		alert('LifeQuest web services are not responding. Please try again in a few minutes.')
		actLogin.hide();
	},serviceTimeout)
	
	// send the data
    xhr.send(lootData);    
}
