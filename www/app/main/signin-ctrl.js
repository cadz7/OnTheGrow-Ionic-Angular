'use strict';

angular.module('sproutApp.controllers')
.controller('SignInCtrl', ['$scope', 'user', '$log', '$state', 'APP_CONFIG',
 function($scope, user, $log, $state, APP_CONFIG) {
	if(APP_CONFIG.useMockData){
		$scope.userForm = {
			email: 'simon@rangle.io',
			password: 'testtest',
			rememberMe: true
		};
	}else{
		$scope.userForm = {
			email: '',
			password: '',
			rememberMe: true
		};
	}

	$scope.signIn = function(submission) {
		// TODO: rememberMe
		$scope.loginErrorMsg = '';
		user.login(submission.email, submission.password,submission.rememberMe).then (
			function() {
				$state.transitionTo('main.stream');
			},
			function() {
				$scope.loginErrorMsg = 'Incorrect Email/Password';
				$log.error('death', arguments);
			}
		);
	}
}]);