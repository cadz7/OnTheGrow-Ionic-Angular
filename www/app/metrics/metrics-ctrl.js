'use strict';

angular.module('sproutApp.controllers')
  .controller('MetricsCtrl', ['$scope', 'headerRemote', function ($scope, headerRemote) {
    $scope.header = headerRemote;
    $scope.logPeriodFilter = 'Week';

    // TODO please note that this may not be the final model and will be wrapped in async service
    $scope.user = {
      firstName: 'John',
      lastName: 'Sintal',
      department: 'Department',
      location: 'Location',
      totalScore: '1500'
    };

    // TODO please note that this may not be the final model and will be wrapped in async service
    $scope.groupedActivities = [
      {
        timePeriod: 'Week 1',
        activities: [
          {
            duration: 12,
            points: 166,
            title: 'Cycling'
          },
          {
            duration: 2,
            points: 33,
            title: 'Baseball'
          }
        ]
      }
    ];


  }]);