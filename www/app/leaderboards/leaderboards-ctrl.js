'use strict';

angular.module('sproutApp.controllers')
  .controller('LeaderboardsCtrl', ['$scope', 'headerRemote', function($scope, headerRemote) {
    $scope.header = headerRemote;

    $scope.leaderboardData = [
      {
        username: 'Bob',
        department: 'Sanitation',
        location: 'New Orleans',
        score: 1400,
        rank: 1
      }
    ];
  }]);