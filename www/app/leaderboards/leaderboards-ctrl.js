'use strict';

angular.module('sproutApp.controllers')
  .controller('LeaderboardsCtrl', ['$scope', 'headerRemote', '$ionicActionSheet', 'leaderboards', 'filters',
    function ($scope, headerRemote, $ionicActionSheet, leaderboards, filters) {
      $scope.header = headerRemote;

      $scope.leaderboardFilter = 'Overall';

      //Periods are used in a repeat to define the period buttons (weekly/quarterly etc) at the top of the
      //leaderboards page
      $scope.periods = leaderboards.periods;
      $scope.leaderboardFilters = filters;

      //Default Params for Leaderboard queries to service - will need to make them more dynamic
      var leaderboardParams = {
        periodId: $scope.periods[0].timePeriodId,
        userFilterId: $scope.leaderboardFilters.userFilters[0].filterId,
        activityFilterId: $scope.leaderboardFilters.activityFilters[0].filterId
      };


      //Checks to see if there is an argument given - if not, it sets to default
      $scope.changeChallengeCategory = function(categoryIndex){
        console.log(categoryIndex);
        if(!categoryIndex){
          leaderboards.getBoard(leaderboardParams).then(function(response){
            $scope.leaderboardData = response;
          });
        }else{
          leaderboardParams.activityFilterId = $scope.leaderboardFilters.activityFilters[categoryIndex].filterId;
          leaderboards.getBoard(leaderboardParams).then(function(response){
            $scope.leaderboardData = response;
          });
        }
      };

      $scope.changeChallengeCategory();

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