'use strict';

angular.module('OnTheGrow.controllers', [])
// ----------------------------------------
// Landing Page controller
// ----------------------------------------
.controller('LandingCtrl', ['$scope', '$state', 'PostsServices', '$ionicPopup', function ($scope, $state, PostsServices, $ionicPopup) {
  $scope.applyjob = function() {
    $state.go('app.lists');
  };
  $scope.givejob = function() {
    $state.go('app.listings');
  };
  PostsServices.getPosts();

  /*
   * Calls the anonymous login function in posts-service and creates a pop-up on successful login.
   */


  $scope.loginWithFacebook = function () {
  	PostsServices.login();
    var alertPopup = $ionicPopup.alert({
	 title: 'Welcome to OnTheGrow !',
	 template: 'Here you can see the list of all foods!'
	});
	alertPopup.then(function(res) {
		$state.go('app.lists');
		console.log('user clicked the popup');
	});
  }

}])