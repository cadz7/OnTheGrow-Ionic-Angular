'use strict';

angular.module('sproutApp.controllers')
  .controller('LeaderboardsCtrl', ['$scope', 'headerRemote', '$ionicActionSheet',
    function($scope, headerRemote, $ionicActionSheet) {
    $scope.header = headerRemote;
    $scope.leaderboardFilter = 'Overall';

    $scope.showLeaderboardFilter = function(){

    $ionicActionSheet.show({
      titleText: 'Filter By Type:',
      // buttons: filters,
      buttons: [{
        text: 'Overall'
      }, {
        text: 'Challenge 1'
      }, {
        text: 'Challenge 2'
      }, {
        text: 'Challenge 3'
      }, {
        text: 'Challenge 4'
      }],
      cancelText: 'Back',
      cancel: function() {
        return true;
      },
      buttonClicked: function(index) {
        $scope.leaderboardFilter = this.buttons[index].text;
        return true;
      }
    });
  };

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