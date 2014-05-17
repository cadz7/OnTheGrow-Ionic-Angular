'use strict';

angular.module('sproutApp.controllers')
.controller('MetricsCtrl', ['$scope', 'headerRemote', function($scope, headerRemote) {
		$scope.header = headerRemote;
}]);