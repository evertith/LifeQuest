if(Titanium.Platform.osname == 'ipad'){
	Titanium.include('app_ipad.js')
} else {
	Titanium.include('app_iphone.js')
}
