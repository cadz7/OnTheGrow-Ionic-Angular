'use strict';

angular.module('sproutApp.controllers')
  .controller('LeaderboardsCtrl', ['$scope', 'headerRemote', function($scope, headerRemote) {
    $scope.header = headerRemote;

    $scope.leaderboardData = [
      {
        username: 'Mariah Carey',
        department: 'Audio Visual',
        location: 'New York',
        score: 1400,
        rank: 1,
        userImage: 'img/user/mariah-s.jpg'
      }
    ];
  }]);