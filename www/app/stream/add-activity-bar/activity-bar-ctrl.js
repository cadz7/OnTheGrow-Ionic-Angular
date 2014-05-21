

angular.module('sproutApp.controllers')
.controller('ActivityBarCtrl', ['$scope', 'activities','streamItems','$ionicScrollDelegate', function($scope, activities,streamItems,$ionicScrollDelegate) {

  var STATES = {categorySelect:'categorySelect',activitySelect:'activitySelect',activityForm:'activityForm'};
  var NAMEKEYS = {activityCategoryDisplayName:'activityCategoryDisplayName',activityName:'activityName'};
  $scope.onTrackActivityClick = function() {
    $scope.addActivityVisible = true;
  };

  $scope.$watch('newPost.text', function(newVal, oldVal){
    //user is not tracking an activty, dont do anything.
    if (!$scope.addActivityVisible) return;
    
    //user has cleared all search text -> take then back to the category select view
    if (!newVal && oldVal) {
      resetActivitySelect();
      return;
    }

    switch (state) {
      case STATES.categorySelect:
        state = STATES.activitySelect;
        selectedActitivities = _.flatten(_.map(activities.categories, function(item){return item.activities}), true);
        console.log(selectedActitivities)
        $scope.title = 'Activities';
        $scope.nameKey = NAMEKEYS.activityName;

        //fall through -> only want to search activities
      case STATES.activitySelect:
        $scope.activityData = _.filter(selectedActitivities,function(val){return val[$scope.nameKey].toLowerCase().indexOf(newVal.toLowerCase()) >= 0;});

      break;
    }//switch    
  });


  var selectedActitivities = [];

  function resetActivitySelect() {
    state = STATES.categorySelect;
    $ionicScrollDelegate.scrollTop();
    $scope.title = 'Activity Categories';
    $scope.activityData = activities.categories;
    $scope.nameKey = NAMEKEYS.activityCategoryDisplayName;
    $scope.activityListVisible = true;
    $scope.showActivityForm = false;
    $scope.errorMessage = '';
    $scope.newPost.text = '';
  }

  resetActivitySelect();
  $scope.onItemSelect = function(item) {
    if(state === STATES.categorySelect) {
      $scope.title = item.activityCategoryDisplayName;
      $scope.activityData = item.activities;
      selectedActitivities = $scope.activityData;
      $scope.nameKey = NAMEKEYS.activityName;
      state = STATES.activitySelect;      
    } else if(state === STATES.activitySelect) {
      $scope.title = item.activityName;
      $scope.activityListVisible = false;
      $scope.showActivityForm = true;
      
      $scope.currentActivity = {
        activityName : item.activityName,
        activityCategoryId : item.activityCategoryId,
        activityUnitId : item.unitId,
        unitName : item.unitName,
        quantity : 1,
        date:$scope.maxDate
        //date : ""+now.getFullYear() + "-"+ (now.getMonth() +1)+ "-" + now.getDate()
      };
      state = STATES.activityForm;

    } else if(state === STATES.activityForm) {
    }
  };

  $scope.cancel = function() {
    resetActivitySelect();
    $scope.activtyQueue = [];
    $scope.addActivityVisible = false;
  };

  $scope.clearActivity = function() {
    resetActivitySelect();        
  };

  $scope.addActivity = function(){
    $scope.activtyQueue.push($scope.currentActivity);
    resetActivitySelect();    
  };

  $scope.saveActivities = function() {
    $scope.savingActivty = true;
    activities.logActivities($scope.activtyQueue)
    .then(function(result){
      streamItems.reload();
      $scope.savingActivty = false;
      $scope.cancel();      
    },function(response){
      $scope.savingActivty = false;
      var errorMessage;
      if (response.status === 403) {
        errorMessage ='You do not have permission to log activities.';        
      }else {
        errorMessage = 'failed to save activity';
      }
      console.error(response);
      $scope.errorMessage = errorMessage;
    });
  };
  $scope.errorMessage = '';
  var now = new Date();
  $scope.activtyQueue = [];
  $scope.maxDate = (now.getFullYear() + '-'+ (now.getMonth()+1 < 10 ?'0':'') +(now.getMonth()+1)+ '-' + (now.getDate() < 10? '0':'')+now.getDate());
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
