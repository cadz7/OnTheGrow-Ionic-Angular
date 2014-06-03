'use strict';

angular.module('sproutApp.controllers')
.controller('SignInCtrl', ['$scope', 'user', '$log', '$state', 'APP_CONFIG','userSettings',
 function($scope, user, $log, $state, APP_CONFIG,userSettings) {
 	if(user.isAuthenticated)
		$state.transitionTo('main.stream');

	if(APP_CONFIG.useMockData || APP_CONFIG.useSimonsCredentials){
		$scope.userForm = {
			email: 'simon@rangle.io',
			password: 'testtest',
			rememberMe: userSettings.data.rememberMe
		};
	}else{
		$scope.userForm = {
			email: '',
			password: '',
			rememberMe: userSettings.data.rememberMe
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
	};

  if (APP_CONFIG.useSimonsCredentials){
    $scope.signIn($scope.userForm);
  }
}]);