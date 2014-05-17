'use strict';

angular.module('sproutApp.controllers')
.controller('LeaderboardsCtrl', ['$scope', 'headerRemote', function($scope, headerRemote) {
		$scope.header = headerRemote;
}]);