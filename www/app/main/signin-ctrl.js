'use strict';

angular.module('sproutApp.controllers')
.controller('SignInCtrl', ['$scope', 'user', '$log', '$state', 'APP_CONFIG',
 function($scope, user, $log, $state, APP_CONFIG) {
	if(APP_CONFIG.useMockData){
		$scope.userForm = {
			username: 'simon@rangle.io',
			password: 'testtest',
			rememberMe: false
		};
	}else{
		$scope.userForm = {
			username: '',
			password: '',
			rememberMe: false
		};
	}

	$scope.signIn = function(submission) {
		// TODO: rememberMe
		user.login(submission.username, submission.password).then (
			function() {
				$state.transitionTo('main.stream');
			},
			function() {
				$log.error('death', arguments);
			}
		);
	}
}]);