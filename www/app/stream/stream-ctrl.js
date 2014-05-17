'use strict';

angular.module('sproutApp.controllers')
.controller('StreamCtrl', ['$scope', 'stream', function($scope, stream) {
	$scope.stream = stream;

	$scope.$on('stateChangeSuccess', function() {
    $scope.stream.loadData();
  });
}]);