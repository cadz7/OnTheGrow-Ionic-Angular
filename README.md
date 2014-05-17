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
		
		gulp develop

2. To see a list of all available gulp tasks run: 
	
		gulp


## Build and Release

1. Substitute ios for android below to build for Android:
		
		$ ionic emulate
		$ ionic run ios 