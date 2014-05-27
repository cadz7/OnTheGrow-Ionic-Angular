

angular.module('sproutApp.controllers')
.controller('ActivityBarCtrl', ['$scope', 'activities','streamItems','$ionicScrollDelegate', '$ionicPopup', 'networkInformation',
  function($scope, activities,streamItems,$ionicScrollDelegate, $ionicPopup, networkInformation) {

  var STATES = {categorySelect:'categorySelect',activitySelect:'activitySelect',activityForm:'activityForm'}; //constants for view state
  var NAMEKEYS = {activityCategoryDisplayName:'activityCategoryDisplayName',activityName:'activityName'}; //constants for accessing display name of the activities
  var selectedActitivities = []; //unfiltered list of activites to display
  
  $scope.currentState = 0;

  // This is to aid in breadcrumb navigation
  // Might need forward/backward navigation if it gets more complex (currently only 2 levels deep)
  $scope.states = [
    {
      name: STATES.categorySelect,
      currentValue: null,
      selectFunction: function(item) {
        $scope.title = item.activityCategoryDisplayName;
        $scope.activityData = item.activities;
        selectedActitivities = $scope.activityData;
        $scope.nameKey = NAMEKEYS.activityName;
        $scope.currentState++;
        $scope.activityListVisible = true;
        $scope.showActivityForm = false;

        this.currentValue = item;
      }
    },
    {
      name: STATES.activitySelect,
      currentValue: null,
      selectFunction: function(item) {
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
        };
        $scope.currentState++;

        this.currentValue = item;
      }
    },
    {
      name: STATES.activityForm,
      currentValue: null,
      selectFunction: function(item) {
        this.currentValue = item;
      }
    }
  ];
  
  //initilze empty scope variables
  $scope.errorMessage = '';
  $scope.activtyQueue = [];
  $scope.currentActivity = {};

  //set the maxium valid date (for input[date]) to today
  var now = new Date();
  $scope.maxDate = (now.getFullYear() + '-'+ (now.getMonth()+1 < 10 ?'0':'') +(now.getMonth()+1)+ '-' + (now.getDate() < 10? '0':'')+now.getDate());


  //show the activity tracker view
  $scope.onTrackActivityClick = function() {
    $scope.addActivityVisible = true;
  };

  //search for activities based on the user's text
  $scope.$watch('newPost.text', function(newVal, oldVal){
    //user has cleared all search text -> take then back to the category select view
    if (!newVal) {
      resetActivitySelect();
      return;
    }

    //if the user has not selected an activity category, search all activities. else search the selected activity category
    switch ($scope.states[$scope.currentState].name) {
      case STATES.categorySelect:
        //change view to the activities view state
        $scope.currentState++;
        $scope.title = 'Activities';
        $scope.nameKey = NAMEKEYS.activityName;
        selectedActitivities = _.flatten(_.pluck(activities.categories,'activities'), true);      

        //fall through -> only want to search on activities
      case STATES.activitySelect:
        //filter the activity list
        $scope.activityData = _.filter(selectedActitivities,function(val){return val[$scope.nameKey].toLowerCase().indexOf(newVal.toLowerCase()) >= 0;});
      break;
    }//switch    
  });

  //reset the activity tracking view state
  function resetActivitySelect() {
    $scope.currentState = 0;
    $ionicScrollDelegate.scrollTop();
    $scope.title = 'Activity Categories';
    $scope.activityData = activities.categories;
    $scope.nameKey = NAMEKEYS.activityCategoryDisplayName;
    $scope.activityListVisible = true;
    $scope.showActivityForm = false;
    $scope.errorMessage = '';
    $scope.newPost = {
      text: ''
    };
    $scope.showNumpad = false;

    _.each($scope.itemStack, function(item) {
      item.currentValue = {};
    });
  }
  resetActivitySelect(); //initalize view

  //change the state of the view when the user selects an activity category or activity
  $scope.onItemSelect = function(item) {
    var currentState = $scope.states[$scope.currentState];

    if (currentState) {
      currentState.selectFunction(item);
    }
  };

  $scope.backtrackBreadcrumb = function() {
    var currentState = $scope.states[$scope.currentState],
        rootIndex = $scope.currentState - 2;

    if (rootIndex > -1) {
      var rootState = $scope.states[rootIndex];
      rootState.selectFunction(rootState.currentValue);
    }
    else {
      resetActivitySelect();
    }
  }

  //user cancels the track activty -> go back to the stream
  $scope.cancel = function() {
    if ($scope.activtyQueue.length > 0) {
      // A confirm dialog
     var confirmPopup = $ionicPopup.confirm({
       title: 'Cancel activity',
       template: 'Are you sure you want to discard your activity updates?'
     });
     confirmPopup.then(function(res) {
       if(res) {
          $scope.createActivityModal.hide();
          resetActivitySelect();
          $scope.activtyQueue = [];
          $scope.addActivityVisible = false;
       }
     });
    }
    else {
      $scope.createActivityModal.hide();
    }
    
  };

  //clear the activty form to add to the queue and go back to category select
  $scope.clearActivity = function() {
    resetActivitySelect();        
  };

  //add activity record to the queuse and go back to category select
  $scope.addActivity = function(){
    $scope.activtyQueue.push($scope.currentActivity);
    resetActivitySelect();    
  };

  //save the activity queue and go back to stream if successful, else display an error
  $scope.saveActivities = function() {
    $scope.savingActivty = true;
    activities.logActivities($scope.activtyQueue)
    .then(function(result){
      streamItems.reload();
      $scope.savingActivty = false;
      $scope.activtyQueue.length = 0;
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

  $scope.keyPress = function(keyCode) {
    if (keyCode===113) { // F2
      if (networkInformation.simulate) {
        networkInformation.simulate.toggleStatus();
      }
    }
  };
  
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
