function NewItem(data){
	var xhr = Titanium.Network.createHTTPClient();
	var restData;
    xhr.setRequestHeader("content-type", "multipart/form-data");
	
	xhr.onload = function()
	{
		Ti.API.error('are we there  yet?')
		clearInterval(timeout);
		Ti.API.error(this.responseText);
	};
	
	// open the client
	xhr.open('POST',apiServer + apiNewItem);
	
	// test service connectivity
	var timeout = setTimeout(function(){
		alert('LifeQuest web services are not responding. Please try again in a few minutes.')
		actLogin.hide();
	},serviceTimeout)
	
    xhr.send(data);    
}
