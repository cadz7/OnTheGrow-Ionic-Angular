'use strict';

angular.module('sproutApp.controllers')
  .controller('MetricsCtrl', ['$scope', 'headerRemote', 'activities', '$log','user','filters', 'scores','$q',
   function ($scope, headerRemote, activities, $log, user, filters, scores, $q) {
    var MILI_SECONDS_IN_DAY = 86400000;

    $scope.header = headerRemote;

    // TODO please note that this may not be the final model and will be wrapped in async service
    $scope.user = user.data;
    $scope.filterIndex = 0;
    $scope.visibleSproutScore = 0; //total user sprout score for the current timespan (ie. log period)
    var allActivities = []; //holds a flattened array of all the activities
    var logPeriodFilter = {};
    filters.whenReady().then(function(){
      $scope.timePeriodFilters = filters.timePeriodFilters;
      return activities.whenReady();
    })
    .then(function() {
       allActivities = _.flatten(_.pluck(activities.categories,'activities'));
      $scope.applyFilter(0);
    })
    .then(null,$log.error);

    $scope.insertNewDateGrouping = function(activityLogIndex){
      if(activityLogIndex == 0)
        return true
      else if (activityLogIndex < 0) 
        return false;
      else {
        var currentActivityDate = new Date($scope.groupedActivities[activityLogIndex].date);
        var prevActivityDate = new Date($scope.groupedActivities[activityLogIndex-1].date);
        return( Math.floor((prevActivityDate - currentActivityDate ) / MILI_SECONDS_IN_DAY) > 0);
      }
    }

    $scope.generateDisplayDate = function(activityDateString){
      var now = new Date();
      var activityDate = new Date(activityDateString);
      var offSetDays = Math.floor((now - activityDate) / MILI_SECONDS_IN_DAY);
      var offSet = '';
      switch (offSetDays){
        case 0:
          offSet = 'TODAY';
          break;
        case 1:
          offSet = 'YESTERDAY';
          break;
        default:
          offSet = '' + offSetDays + ' DAYS AGO';
          break;
      }

      return offSet + ' - ' + activityDate.toDateString();
    }


    /*
    * iterates through the loaded list of activities to find the corresponding activities for the 
    * logged activities and assigns the display name and the unit display name
    *
    * @param  {array, required} activityLogs  array of logged activities
    * @returns {array} the given activityLogs with the display names attached
    */
     function attachDisplayNames(activityLogs) {
        
      return _.map(activityLogs, function(activityLog) {
        var activity = _.find(allActivities,{unitId:activityLog.activityUnitId});
        activityLog.activityDisplayName = activity ? activity.activityName : 'Unknown Activity';
        activityLog.activityUnitDisplayName = activity ? activity.unitName :'Unknown Unit';
        return activityLog;
      });      
     };     

    // get a list of activity log using the selected filter and updates the sprout score
    $scope.applyFilter = function(filterIndex) {
      if(logPeriodFilter === filters.timePeriodFilters[filterIndex])
       return; //dont reaply the current filter

      $scope.filterIndex = filterIndex;
      logPeriodFilter = filters.timePeriodFilters[filterIndex];
      $q.all([activities.loadActivityLog(logPeriodFilter.filterId,0), 
               scores.getScoresForUser(logPeriodFilter.filterId)])
      .then(function(results) {
          $scope.groupedActivities = attachDisplayNames(activities.activityLog);
          $scope.visibleSproutScore = results[1][0].score;
        })
        .then(null,$log.error);
    };

    //load more logs for the given activity log
    $scope.performInfiniteScroll = _.throttle(function() {
        $scope.$evalAsync(function() {
          if (typeof $scope.groupedActivities === 'undefined' || $scope.groupedActivities.length == 0 ) return;

          activities.loadActivityLog(logPeriodFilter.filterId,
                                      _.last($scope.groupedActivities).activityLogId)
          .then(function(activityLogs){
            if(activityLogs.length<1){
              return;
            }

            $scope.groupedActivities = _.union($scope.groupedActivities,attachDisplayNames(activities.activityLog));            
          })
          .finally(function(){
            $scope.$broadcast('scroll.infiniteScrollComplete');
          })
        });
      }, 250);
  }]);