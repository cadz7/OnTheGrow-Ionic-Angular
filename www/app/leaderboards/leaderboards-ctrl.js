'use strict';

angular.module('sproutApp.controllers')
  .controller('LeaderboardsCtrl', ['$scope', 'headerRemote', '$ionicActionSheet', 'leaderboards',
    function ($scope, headerRemote, $ionicActionSheet, leaderboards) {
      $scope.header = headerRemote;

      $scope.leaderboardFilter = 'Overall';

      var leaderboardParams = {
        periodId: 101,
        userFilterId: 201,
        activityFilterId: 301
      };

      $scope.periods = leaderboards.periods;

      $scope.selectPeriod = function(periodID){
        if(!periodID){
          leaderboards.getBoard(leaderboardParams).then(function(response){
            $scope.leaderboardData = response;
            console.log(response);
          });
        }else{
          leaderboardParams.periodId = periodID;

          leaderboards.getBoard(leaderboardParams).then(function(response){
            $scope.leaderboardData = response;
            console.log(response);
          });
        }
      };

      $scope.selectPeriod();


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