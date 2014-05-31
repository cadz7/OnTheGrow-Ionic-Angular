'use strict';

angular.module('sproutApp.controllers')
  .controller('LeaderboardsCtrl',
  ['$scope', 'headerRemote', '$ionicActionSheet', '$ionicSlideBoxDelegate',
    'leaderboards', 'filters', 'activities', 'user',
    function ($scope, headerRemote, $ionicActionSheet, $ionicSlideBoxDelegate,
              leaderboards, filters, activities, user) {
      $scope.header = headerRemote;

      var leaderboardParams = {};
      var activityCategoryFilters =[];
      //Periods are used in a repeat to define the period buttons (weekly/quarterly etc) at the top of the
      //leaderboards page
      filters.whenReady().then(function(){
        console.log('filters ready')
        
        $scope.periods = filters.timePeriodFilters;
        $scope.activityFilters = filters.activityFilters;
        angular.forEach(filters.activityFilters,function(cat){
          cat.text = cat.displayName;
          activityCategoryFilters.push(cat);
        });

        $scope.selectedCategory = filters.activityFilters[0];
        $scope.activePeriod = filters.defaultTimePeriod;
        
        leaderboardParams = {
          periodId: $scope.activePeriod.filterId,
          userFilterId: user.data.userId,
          activityFilterId: filters.activityFilters[0].filterId
        };

        $scope.getLeaderboards();

      });

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
        $scope.selectedCategory = activityObj;
        leaderboardParams.activityFilterId = activityObj.filterId;
        $scope.getLeaderboards(leaderboardParams);
        $scope.toggleActivityList();
      };

      $scope.showLeaderboardFilter = function () {

        $ionicActionSheet.show({
          titleText: 'Filter By Type:',
          // buttons: filters,
          buttons: activityCategoryFilters,
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