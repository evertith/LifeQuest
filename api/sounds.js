var Sounds = function(){
	//Are we developing on a POS hackintosh that does not have a working sound card?
	var hackintosh = false;
	if(Ti.Platform.model == 'Simulator'){
		hackintosh = false;
	}
	
	//Do we even want to play sounds?
	var playMusic = Ti.App.Properties.getBool('playMusic');
	var playSounds = Ti.App.Properties.getBool('playSounds');
	
	//Dropbox location
	var dropBox = 'http://dl.dropbox.com/u/76059893/lifequest/'
	
	
	//Module definition for sounds and music
	var self = {
		titleScreen:{
			music:{
				sound: CreateSound(dropBox + 'music/titleScreen/music.mp3',true,1,true),
			},
			sfx:{ 
				//
				loginSlideOpen: CreateSound(dropBox + 'sfx/titleScreen/loginSlideOpen.mp3',false,1,false),
				loginTextboxFocus: CreateSound(dropBox + 'sfx/titleScreen/loginTextboxFocus.mp3',false,1,false),
				loginActionButton: CreateSound(dropBox + 'sfx/titleScreen/loginActionButton.mp3',false,1,false),
				//
				registerSlideOpen: CreateSound(dropBox + 'sfx/titleScreen/registerSlideOpen.mp3',false,1,false),
				registerActionButton: CreateSound(dropBox + 'sfx/titleScreen/registerActionButton.mp3',false,1,false),
			}
		},
		homeScreen:{
			music:{
				sound: CreateSound(dropBox + 'music/homeScreen/music.mp3',true,1,true),
				brickerback: CreateSound(dropBox + 'music/homeScreen/brickerbackMerchantMusic.mp3',true,1,true)
			},
			sfx:{ 

			}
		},
		//----------------------------------
		// IGNORE THE FOLLOWING SOUNDS BELOW
		//----------------------------------
		registrationScreen:{
			music:{
				sound: CreateSound(dropBox + 'music/registrationScreen/music.mp3',true,1,true),
			},
			sfx:{
				explaination: CreateSound('lqRegister1.mp3',false,1,false),
			}
		},
		play:function(params){
			if(params.isMusic){
				if(playMusic){
					try{
						params.sound.stop();
						params.sound.start();
					}
					catch(e){
						Ti.API.error(e);
					}
					
				}
			} else {
				if(playSounds){
					try{
						params.sound.stop();
						params.sound.play();
					}
					catch(e){
						Ti.API.error(e);
					}
				}
			}
		},
		stop:function(params){
			try{
				params.sound.stop();
			}
			catch(e){
				Ti.API.error(e);
			}
		},
	}
	
	
	function CreateSound(filename,loop,volume,streaming){
		var sound;
		if(!hackintosh){
			if(streaming){
				sound = Titanium.Media.createAudioPlayer({url:filename,volume:volume,bufferSize:512});
				sound.addEventListener('change',function(e){
					if(e.state == Titanium.Media.AudioPlayer.STATE_STOPPED){
						e.source.start();
					}
				})
			} else {
				sound = Titanium.Media.createSound({url:filename,preload:false,looping:loop,volume:volume})
			}
		}
		return sound;
		
	}
	
	return self;
}

module.exports = Sounds;
