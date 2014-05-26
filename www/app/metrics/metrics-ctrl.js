'use strict';

angular.module('sproutApp.controllers')
  .controller('MetricsCtrl', ['$scope', 'headerRemote', 'activities', '$log','user','filters',
   function ($scope, headerRemote, activities, $log, user, filters) {
    $scope.header = headerRemote;
    

    // TODO please note that this may not be the final model and will be wrapped in async service
    $scope.user = user.data;
    $scope.timePeriodFilters = filters.timePeriodFilters;
    $scope.logPeriodFilter = $scope.timePeriodFilters[0];

    activities.whenReady().then(function() {
      $log.debug('activities.activityLog', activities.activityLog);
      $scope.groupedActivities = activities.loadActivityLog($scope.logPeriodFilter.id);

    });

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