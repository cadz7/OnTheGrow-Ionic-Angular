'use strict';

angular.module('sproutApp.controllers')
  .controller('LeaderboardsCtrl', ['$scope', 'headerRemote', '$ionicActionSheet', 'leaderboards',
    function ($scope, headerRemote, $ionicActionSheet, leaderboards) {
      $scope.header = headerRemote;

      $scope.leaderboardFilter = 'Overall';

      //Default Params for Leaderboard queries to service - will need to make them more dynamic
      var leaderboardParams = {
        periodId: 101,
        userFilterId: 201,
        activityFilterId: 301
      };

      //Periods are used in a repeat to define the period buttons (weekly/quarterly etc) at the top of the
      //leaderboards page
      $scope.periods = leaderboards.periods;

      //Checks to see if there is an argument given - if not, it sets to default period, ie, weekly
      $scope.selectPeriod = function(periodID){
        console.log('sliders!');
        if(!periodID){
          leaderboards.getBoard(leaderboardParams).then(function(response){
            $scope.leaderboardData = response;
          });
        }else{
          leaderboardParams.periodId = periodID;

          leaderboards.getBoard(leaderboardParams).then(function(response){
            $scope.leaderboardData = response;
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