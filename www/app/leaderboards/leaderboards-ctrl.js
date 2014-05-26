'use strict';

angular.module('sproutApp.controllers')
  .controller('LeaderboardsCtrl',
  ['$scope', 'headerRemote', '$ionicActionSheet', '$ionicSlideBoxDelegate',
    'leaderboards', 'filters', 'activities', 'user',
    function ($scope, headerRemote, $ionicActionSheet, $ionicSlideBoxDelegate,
              leaderboards, filters, activities, user) {
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
        userFilterId: 13,
        activityFilterId: $scope.leaderboardFilters.activityFilters[0].filterId
      };


      //Checks to see if there is an argument given - if not, it sets to default
      $scope.getLeaderboards = function(){
          leaderboards.getBoards(leaderboardParams).then(function(response){
            $scope.leaderBoards = response;
            $scope.currentBoardTitle = $scope.leaderBoards[0].leaderboardNameDisplay;

            //Resolves issue with everything being stretched until resize after a new request
            $ionicSlideBoxDelegate.update();
          });
      };

      $scope.switchBoard = function(boardIdx){
        $scope.currentBoardTitle = $scope.leaderBoards[boardIdx].leaderboardNameDisplay;
      };

      $scope.getLeaderboards();

      $scope.getPeriod = function(periodIndex){
        $scope.activePeriod = $scope.periods[periodIndex];
        leaderboardParams.periodId = $scope.activePeriod.timePeriodId;
        $scope.getLeaderboards(leaderboardParams);
      };

      $scope.toggleFiltersView = function(){
        $scope.editFilters = !$scope.editFilters;

        //resolves issue with 0 width slide box until window resize
        $ionicSlideBoxDelegate.update();
      };

      $scope.toggleActivityList = function(){
        $scope.activityView = !$scope.activityView;
      };

      $scope.selectActivityFilter = function(activityObj){
        $scope.activeActivity = activityObj;
        leaderboardParams.activityFilterId = $scope.activeActivity.unitId;
        $scope.getLeaderboards(leaderboardParams);
        $scope.toggleActivityList();
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
            $scope.selectedCategory = this.buttons[index];
            leaderboardParams.userFilterId = this.buttons[index].activityCategoryId;
            $scope.getLeaderboards(leaderboardParams);
            return true;
          }
        });
      };

    }]);