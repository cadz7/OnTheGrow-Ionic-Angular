
angular.module('sproutApp.controllers')
.controller('ActivityBarCtrl', ['$scope', 'activities', function($scope, activities) {

  $scope.onTrackActivityClick = function() {
    $scope.addActivityVisible = true;
  };

  $scope.title = 'Activity Categories';

  var state = 'categorySelect';

  function resetActivitySelect() {
    $scope.title = 'Activity Categories';
    $scope.activityData = activities;
    $scope.nameKey = 'activityCategoryDisplayName';
    state = 'categorySelect';
    $scope.activityListVisible = true;
    $scope.addActivityVisible = false;
    $scope.showActivityForm = false;
  }

  resetActivitySelect();

  $scope.onItemSelect = function(item) {
    if(state === 'categorySelect') {
      $scope.title = item.activityCategoryDisplayName;
      $scope.activityData = item.activities;
      $scope.nameKey = 'activityName';
      state = 'activitySelect';

    } else if(state === 'activitySelect') {
      $scope.title = item.activityName;
      $scope.activityListVisible = false;
      $scope.showActivityForm = true;
      var now = new Date();
      $scope.currentActivity = {
        activityName : item.activityName,
        activityCategoryId : item.activityCategoryId,
        activityUnitId : item.unitId,
        unitName : item.unitName,
        date:(now.getFullYear() + '-'+ (now.getMonth()+1 < 10 ?'0':'') +(now.getMonth()+1)+ '-' + (now.getDate() < 10? '0':'')+now.getDate())
        //date : ""+now.getFullYear() + "-"+ (now.getMonth() +1)+ "-" + now.getDate()
      };
      state = 'activityForm';

    } else if(state === 'activityForm') {
    }
  };

  $scope.cancel = function() {
    resetActivitySelect();
  };

  $scope.saveActivity = function() {
    console.log($scope.currentActivity)
    console.log(activities)
    activities.logActivities([$scope.currentActivity])
    .then(function(result){
      console.log(result)
      $scope.cancel();
    },function(response){
      if (response.status === 403) {
        console.error('You do not have permission to log activities.');
      }else {
        console.err(response)
      }
    });
  };

  $scope.activityDataAll = activities;
  $scope.currentActivity = {};
}])

/*
 * Shrinking/fading header directive
 */
.directive('headerShrink', ['$document', function($document) {
  var fadeAmt;

  var streamContent = $document[0].getElementById('sproutPostsScroller');

  var shrink = function(header, content, amt, max) {
    amt = Math.min(120, amt);
    fadeAmt = 1 - amt / 120;
    ionic.requestAnimationFrame(function() {
      header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
      streamContent.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';

      for(var i = 0, j = header.children.length; i < j; i++) {
        header.children[i].style.opacity = fadeAmt;
      }
    });
  };

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var starty = $scope.$eval($attr.headerShrink) || 0;
      var shrinkAmt;
      
      var header = $document[0].body.querySelector('.add-activity-post');
      var headerHeight = header.offsetHeight;
      
      $element.bind('scroll', function(e) {
        if(e.detail.scrollTop > starty) {
          // Start shrinking
          shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - e.detail.scrollTop);
          shrink(header, $element[0], shrinkAmt, headerHeight);
        } else {
          shrink(header, $element[0], 0, headerHeight);
        }
      });
    }
  };
}]);
