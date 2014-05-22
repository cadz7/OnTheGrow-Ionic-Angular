'use strict';

angular.module('sproutApp.controllers')
  .controller('LeaderboardsCtrl',
  ['$scope', 'headerRemote', '$ionicActionSheet', 'leaderboards', 'filters', 'activities',
    function ($scope, headerRemote, $ionicActionSheet, leaderboards, filters, activities) {
      $scope.header = headerRemote;


      //Periods are used in a repeat to define the period buttons (weekly/quarterly etc) at the top of the
      //leaderboards page
      $scope.periods = leaderboards.periods;
      $scope.leaderboardFilters = filters;
      $scope.rankingOptions = leaderboards.rankingOptions;

      //adds a text property for the ionicActionSheet
      activities.categories.forEach(function(cat){
        cat.text = cat.activityCategoryDisplayName;
      });

      $scope.selectedCategory = activities.categories[0];

      //Default Params for Leaderboard queries to service - will need to make them more dynamic
      var leaderboardParams = {
        periodId: $scope.periods[0].timePeriodId,
        userFilterId: $scope.leaderboardFilters.userFilters[0].filterId,
        activityFilterId: $scope.leaderboardFilters.activityFilters[0].filterId
      };


      //Checks to see if there is an argument given - if not, it sets to default
      $scope.changeRankingOption = function(categoryIndex){
        if(!categoryIndex && categoryIndex !== 0){
          $scope.currentRankingCategory = $scope.rankingOptions[0];
          leaderboards.getBoard(leaderboardParams).then(function(response){
            $scope.leaderboardData = response;
          });
        }else{
          leaderboardParams.activityFilterId = $scope.rankingOptions[categoryIndex].id;
          $scope.currentRankingCategory = $scope.rankingOptions[categoryIndex];

          leaderboards.getBoard(leaderboardParams).then(function(response){
            $scope.leaderboardData = response;
          });
        }
      };

      $scope.changeRankingOption();

      $scope.selectActivityFilter = function(activityObj){
        $scope.activeActivity = activityObj;
      };

      $scope.showLeaderboardFilter = function () {

        $ionicActionSheet.show({
          titleText: 'Filter By Type:',
          // buttons: filters,
          buttons: activities.categories,
          cancelText: 'Back',
          cancel: function () {
            return true;
          },
          buttonClicked: function (index) {

            //Todo: refactor
            $scope.selectedCategory = this.buttons[index];
            return true;
          }
        });
      };

    }]);