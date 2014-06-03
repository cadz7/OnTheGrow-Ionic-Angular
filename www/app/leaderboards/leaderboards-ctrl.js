'use strict';

angular.module('sproutApp.controllers')
  .controller('LeaderboardsCtrl',
  ['$scope', 'headerRemote', '$ionicActionSheet', '$ionicSlideBoxDelegate',
    'leaderboards', 'filters', 'activities', 'user',
    function ($scope, headerRemote, $ionicActionSheet, $ionicSlideBoxDelegate,
              leaderboards, filters, activities, user) {
      $scope.header = headerRemote;
      $scope.showLeaderBoardFilters = false;
      var leaderboardParams = {};
      var activityCategoryFilters =[];
      $scope.activitySearchText = {};
      //Periods are used in a repeat to define the period buttons (weekly/quarterly etc) at the top of the
      //leaderboards page
      filters.whenReady()
      .then(function(){
        $scope.periods = filters.timePeriodFilters;
        $scope.activityFilters = filters.activityFilters;
        $scope.leaderBoardFilters = filters.leaderBoardFilters;
     
        $scope.rankingOptions = leaderboards.rankingOptions;
        $scope.selectedCategory = filters.activityFilters[0];
        $scope.activePeriod = filters.defaultTimePeriod;
        $scope.selectedLeaderBoardFilter = filters.leaderBoardFilters[0];

        leaderboardParams = {
          periodId: $scope.activePeriod.filterId,
          userFilterId: $scope.selectedLeaderBoardFilter.filterId,
          activityFilterId: filters.activityFilters[0].filterId
        };

        getLeaderboards();
      });


      //Checks to see if there is an argument given - if not, it sets to default
      var getLeaderboards = function(){
        leaderboards.getBoards(leaderboardParams)
          .then(function(response){
            $scope.leaderBoards = null;
            $scope.leaderBoards = response;
            $scope.currentBoardTitle = $scope.leaderBoards[0].leaderboardNameDisplay;

            //Resolves issue with everything being stretched until resize after a new request
            $ionicSlideBoxDelegate.update();
          });
      };

      //as the user scrolls left/right, change the leaderboardFilter
      $scope.switchBoard = function(boardIdx) {      
        $scope.currentBoardTitle = $scope.leaderBoards[boardIdx].leaderboardNameDisplay;
      };

      //as the user changes the time period slider, update the leaderboard
      $scope.getPeriod = function(periodIndex){
        $scope.activePeriod = $scope.periods[periodIndex];
        leaderboardParams.periodId = $scope.activePeriod.filterId;        
      };

      //hide/show the edit filters view
      $scope.toggleFiltersView = function(){
        $scope.editFilters = !$scope.editFilters;
        if ($scope.editFilters) {
          //showing 'edit filters'
          var index = _.findIndex(filters.timePeriodFilters,$scope.activePeriod);
          $ionicSlideBoxDelegate.$getByHandle('PeriodSlider').slide(index);
        } else {
          //hiding 'edit filters'
          getLeaderboards(leaderboardParams);
        }
        //resolves issue with 0 width slide box until window resize
        $ionicSlideBoxDelegate.update();
      };

      //show/hide the list of activity filter buttons + clear search
      $scope.toggleActivityList = function(){
        $scope.activityView = !$scope.activityView;
        $scope.activitySearchText.displayName = '';
      };

      $scope.toggleLeaderBoardFilters = function(){
        $scope.showLeaderBoardFilters = !$scope.showLeaderBoardFilters;
      };

      //select an activity filter , and then reload the leaderboard
      $scope.selectActivityFilter = function(activityObj){
        $scope.selectedCategory = activityObj;
        leaderboardParams.activityFilterId = activityObj.filterId;
        $scope.toggleActivityList();
      };     

      //apply the selected leaderboard type filter
      $scope.selectLeaderBoardFilter = function(filter){
        leaderboardParams.userFilterId = filter.filterId;
        $scope.toggleLeaderBoardFilters();
        $scope.leaderBoardFilters = filters.leaderBoardFilters;
        $scope.selectedLeaderBoardFilter = filter;
        getLeaderboards();
      };

      $scope.showSubLeadboardFilters = function(filter){
        $scope.leaderBoardFilters = filter.subFilters;
      }

    }]);