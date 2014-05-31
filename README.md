# Sprout App

## Install

1. Install Ionic, Cordova and Gulp
		$ npm install -g cordova ionic

2. Install Node.js and run:
		
		$ npm install

3. To install SASS run: 
		
		gem install sass


## Develop

1. To start a server in the www folder and watch/compile/minify sass:
		
		gulp   OR gulp dev

2. To see a list of all available gulp tasks run: 
	
		<TBD>

## Configuration

All app configuration should be done through www/client-config.js


- the API endpoint is defined at `.constant('API_URL',...)`
- To use mock data change `.constant(APP_CONFIG, ... useMockData )` to true and foreach service change the injected server to the mock server factory below the service  

## Build and Release
### Configure to Build
1. First time iOS build on a computer
		npm install -g ios-deploy ios-sim
		# Note- ionic will prompt you for these from commands below if not in place.
		
		$ ionic platform add ios

2. First time Android build on a computer

		$ ionic platform add android

### Build and Run
1. Run from command line for ios
		
		$ ionic emulate ios
		$ ionic run ios

2. Run from command line on android

		$ ionic emulate android
		$ ionic run android

## iOS Notes
## Configuring to run on your connected phone requires a provisioning profile to be set.
1. open www/platforms/ios/SproutApp.xcodeproj
2. Build Settings....All....filter by "code sign"
3. Set the project provisioning profile

## Plugins used
### To install 'cordova plugin add <plugin name or URL if provided>'

cordova plugin add org.apache.cordova.device
cordova plugin add org.apache.cordova.console
cordova plugin add https://github.com/driftyco/ionic-plugins-keyboard.git
cordova plugin add https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin.git

cordova plugin add https://github.com/phonostar/PhoneGap-SoftKeyboard.git

## Debugging Notes
- if plugins aren't installed user autologin won't work due to plugin error stopping it from running.