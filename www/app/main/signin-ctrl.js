'use strict';

angular.module('sproutApp.controllers')
.controller('SignInCtrl', ['$scope', 'user', '$log', '$state', function($scope, user, $log, $state) {
	$scope.userForm = {
		username: '',
		password: '',
		rememberMe: false
	};

	$scope.signIn = function(submission) {
		// TODO: rememberMe
		user.login(submission.username, submission.password).then (
			function() {
				//$log.debug('success', arguments);
				$state.transitionTo('main.stream');
			},
			function() {
				$log.error('death', arguments);
			}
		);
	}
}]);