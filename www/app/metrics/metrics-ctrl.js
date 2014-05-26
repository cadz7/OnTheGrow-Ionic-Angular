'use strict';

angular.module('sproutApp.controllers')
  .controller('MetricsCtrl', ['$scope', 'headerRemote', 'activities', '$log','user','filters', 'scores',
   function ($scope, headerRemote, activities, $log, user, filters,scores) {
    $scope.header = headerRemote;
    

    // TODO please note that this may not be the final model and will be wrapped in async service
    $scope.user = user.data;
    $scope.timePeriodFilters = filters.timePeriodFilters;
    $scope.logPeriodFilter = $scope.timePeriodFilters[0];
    $scope.visibleSproutScore = 0; //total user sprout score for the current timespan (ie. log period)
    
    scores.getScoresForUser($scope.logPeriodFilter.filterId)
    .then(function(scores){
      $scope.visibleSproutScore = scores[0].score;
    },$log.error);

    activities.whenReady().then(function() {
      
      return activities.loadActivityLog($scope.logPeriodFilter.id);
    })
    .then(function(){
      $log.debug('activities.activityLog', activities.activityLog);
      $scope.groupedActivities = activities.activityLog      
    })
    .then(null,$log.error);
      
      


    $scope.applyFilter = function(filter) {
      $scope.logPeriodFilter = filter;

      //TODO: make API req applying this time filter
    };

    //since the API only returns the unit id, figure out what the display name for it is
    $scope.getUnitName = function (unitId) {
      switch(unitId){
        default:
          return 'Unknown Units';
      }
    };


    //on filter change, get activity log


//    $scope.groupedActivities = [
//      {
//        timePeriod: 'Week 1',
//        activities: [
//          {
//            duration: 12,
//            points: 166,
//            title: 'Cycling'
//          },
//          {
//            duration: 2,
//            points: 33,
//            title: 'Baseball'
//          }
//        ]
//      }
//    ];
  }]);