'use strict';

angular.module('OnTheGrow.controllers', [])
// ----------------------------------------
// Controller for the browse view
// ----------------------------------------
.controller('LandingCtrl', ['$scope', '$state', 'PostsServices', '$ionicPopup', function ($scope, $state, PostsServices, $ionicPopup) {
  $scope.applyjob = function() {
    $state.go('app.lists');
  };
  $scope.givejob = function() {
    $state.go('app.listings');
  };
  PostsServices.getPosts();

  $scope.loginWithFacebook = function () {
  	var user = PostsServices.loginWithFacebook();
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