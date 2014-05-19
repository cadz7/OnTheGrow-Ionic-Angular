'use strict';

angular.module('sproutApp.controllers')
  .controller('LeaderboardsCtrl', ['$scope', 'headerRemote', '$ionicActionSheet', 'leaderboards',
    function ($scope, headerRemote, $ionicActionSheet, leaderboards) {
      $scope.header = headerRemote;

      $scope.leaderboardFilter = 'Overall';

      var defaultLeaderboardParams = {
        periodId: 101,
        userFilterId: 201,
        activityFilterId: 301
      };

      leaderboards.getBoard(defaultLeaderboardParams).then(function(response){
        $scope.leaderboardData = response;
        console.log(response);
      });



      $scope.showLeaderboardFilter = function () {

        $ionicActionSheet.show({
          titleText: 'Filter By Type:',
          // buttons: filters,
          buttons: [
            {
              text: 'Overall'
            },
            {
              text: 'Challenge 1'
            },
            {
              text: 'Challenge 2'
            },
            {
              text: 'Challenge 3'
            },
            {
              text: 'Challenge 4'
            }
          ],
          cancelText: 'Back',
          cancel: function () {
            return true;
          },
          buttonClicked: function (index) {
            $scope.leaderboardFilter = this.buttons[index].text;
            return true;
          }
        });
      };

    }]);