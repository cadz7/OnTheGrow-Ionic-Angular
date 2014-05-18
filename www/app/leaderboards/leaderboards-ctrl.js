'use strict';

angular.module('sproutApp.controllers')
  .controller('LeaderboardsCtrl', ['$scope', 'headerRemote', function($scope, headerRemote) {
    $scope.header = headerRemote;

    $scope.leaderboardData = [
      {
        user_id : 1971,
        name: 'Mariah',
        department: 'Audio Visual',
        location: 'New York',
        score: 1400,
        rank: 1,
        isViewer: true,
        userImage: 'img/user/mariah-s.jpg'
      },
      {
        user_id : 1971,
        name: 'Bruno',
        department: 'Audio Visual',
        location: 'New York',
        score: 500,
        rank: 4,
        isViewer: true,
        userImage: 'img/user/bruno-s.jpg'
      },
      {
        user_id : 1971,
        name: 'Martin',
        department: 'Audio Visual',
        location: 'New York',
        score: 1100,
        rank: 2,
        isViewer: true,
        userImage: 'img/user/martin-garrix-m.jpg'
      },
      {
        user_id : 1971,
        name: 'Slash',
        department: 'Audio Visual',
        location: 'New York',
        score: 850,
        rank: 3,
        isViewer: true,
        userImage: 'img/user/slash-s.jpg'
      }
    ];
  }]);