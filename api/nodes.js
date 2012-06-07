function GetNodes(coords,mapview){
	var xhr = Titanium.Network.createHTTPClient();
	var restData;
    xhr.setRequestHeader("content-type", "multipart/form-data");
	
	xhr.onload = function()
	{
		clearInterval(timeout);
		Ti.API.error(this.responseText);
		var nodes = JSON.parse(this.responseText);
		mapview.fireEvent('nodesFound',{data:nodes});
	};
	
	// open the client
	xhr.open('POST',apiServer + apiGetNodes);
	
	// test service connectivity
	var timeout = setTimeout(function(){
		alert('LifeQuest web services are not responding. Please try again in a few minutes.')
		actLogin.hide();
	},serviceTimeout)
	
	// send the data
    var params = {
      lat:coords.latitude,
      lng:coords.longitude
    };
    xhr.send(params);    
}
