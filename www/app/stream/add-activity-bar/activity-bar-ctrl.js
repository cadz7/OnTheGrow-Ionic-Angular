

angular.module('sproutApp.controllers')
.controller('ActivityBarCtrl', ['$scope', 'activities','streamItems','$ionicScrollDelegate', 'uiConfirmation', 'networkInformation', 'Notify',
  function($scope, activities,streamItems,$ionicScrollDelegate, uiConfirmation, networkInformation, Notify) {

  var STATES = {categorySelect:'categorySelect',activitySelect:'activitySelect',activityForm:'activityForm'}; //constants for view state
  var NAMEKEYS = {activityCategoryDisplayName:'activityCategoryDisplayName',activityName:'activityName'}; //constants for accessing display name of the activities
  var selectedActitivities = []; //unfiltered list of activites to display
  var  allActivities = [];

  var resetForm = function() {
    if ($scope.activityFormPointer) {
      $scope.activityFormPointer.activityForm.$setPristine(true);
    }
  }
  
  $scope.currentState = 0;
  $scope.amEditing = null;

  $scope.preferredUnits = {};
  $scope.currentActivityUnits = [];
  $scope.selectedActivityUnit = {};

  $scope.previousState = 0;
  $scope.categoryListData = [];

  $scope.activityUnitSelected = function(newVal) {
    if (newVal && 'activityName' in $scope.currentActivity && $scope.currentActivity.activityName) {
      $scope.preferredUnits[$scope.currentActivity.activityName] = newVal;
      $scope.selectedActivityUnit = newVal;

      $scope.currentActivity.activityUnitId = newVal.unitId;
      $scope.currentActivity.unitName = newVal.unitName;

      resetForm();
      $scope.$broadcast('app.onDemandFocus.activityQuantity');
    }
  };

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
        $scope.currentState = 1;
        $scope.activityListVisible = true;
        $scope.showActivityForm = false;
        $ionicScrollDelegate.scrollTop(false);

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
        $ionicScrollDelegate.scrollTop(false);
        
        $scope.currentActivity = {
          activityName : item.activityName,
          activityCategoryId : item.activityCategoryId,
          quantity : item.quantity,
          date:$scope.maxDate        
        };
        
        $scope.currentActivityUnits = item.activityUnits;
        if(item.selectedUnit){
          $scope.currentActivity.activityUnitId = item.selectedUnit.unitId;
          $scope.currentActivity.unitName = item.selectedUnit.unitName;

          $scope.selectedActivityUnit = item.selectedUnit;
        }
        else if (!$scope.preferredUnits[item.activityName]) {
          $scope.currentActivity.activityUnitId = item.activityUnits[0].unitId;
          $scope.currentActivity.unitName = item.activityUnits[0].unitName;

          $scope.preferredUnits[item.activityName] = $scope.selectedActivityUnit = item.activityUnits[0];
        }
        else {
          $scope.currentActivity.activityUnitId = $scope.preferredUnits[item.activityName].unitId;
          $scope.currentActivity.unitName = $scope.preferredUnits[item.activityName].unitName;

          $scope.selectedActivityUnit = $scope.preferredUnits[item.activityName];
        }

        $scope.currentState = 2;

        $scope.$broadcast('app.onDemandFocus.activityQuantity');

        this.currentValue = item;
      }
    },
    {
      name: STATES.activityForm,
      currentValue: null,
      selectFunction: function(item) {
        this.currentValue = item;

        $scope.currentState = 3;
      }
    }
  ];
  
  //initilze empty scope variables
  $scope.errorMessage = '';
  $scope.activtyQueue = [];
  $scope.currentActivity = {};
  $scope.currentActivityUnits = [];

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

      // restore user to the state they were in before searching (either category or activity view)
      $scope.currentState = $scope.previousState;

      if ($scope.currentState === 0) {
        // only reset if they were in category view prior to searching
        resetActivitySelect();
        return;
      }
    }
    else if (!oldVal) {
      // User is just starting to search for something
      $scope.previousState = $scope.currentState;

      $scope.searchCategoryListVisible = true;
    }

    //if the user has not selected an activity category, search all activities. else search the selected activity category
    switch ($scope.states[$scope.previousState].name) {
      case STATES.categorySelect:
        //change view to the activities view state
        $scope.currentState = 1;
        $scope.title = 'Activities';
        $scope.nameKey = NAMEKEYS.activityName;
        selectedActitivities = _.flatten(_.pluck(activities.categories,'activities'), true);

        $scope.activityData = _.filter(selectedActitivities,function(val){return val[$scope.nameKey].toLowerCase().indexOf(newVal.toLowerCase()) >= 0;});

        //fall through -> only want to search on activities
      case STATES.activitySelect:
        //filter the activity list
        
        $scope.activityData = _.filter(selectedActitivities,function(val){return val[$scope.nameKey].toLowerCase().indexOf(newVal.toLowerCase()) >= 0;});
      break;
    }//switch    
    
    $scope.categoryListData = _.filter(activities.categories,function(val){return val[NAMEKEYS.activityCategoryDisplayName].toLowerCase().indexOf(newVal.toLowerCase()) >= 0;});
    
  });
  
  $scope.$on('app.formLocator.activityForm', function(evt, form) {
    $scope.activityFormPointer = form.scope;
    evt.stopPropagation();
  });
  
  //reset the activity tracking view state
  function resetActivitySelect() {
    resetForm();
    activities.getSugestedActivities()
    .then(function(suggestedActivities){

      $scope.suggestedActivities = _.map(suggestedActivities, function(suggestedActivity) {
        var activity = _.find(allActivities,function(act){
          return _.any(act.activityUnits,{unitId:suggestedActivity.activityUnitId});
        });
        suggestedActivity.activityDisplayName = activity ? activity.activityName : 'Unknown Activity';
        if(typeof activity !== 'undefined' && activity){
          var unit =  _.find(activity.activityUnits,{unitId:suggestedActivity.activityUnitId});
          suggestedActivity.activityUnitDisplayName = unit ? unit.unitName :'Unknown Unit';
        }else{
          suggestedActivity.activityUnitDisplayName = 'Unknown Unit';
        }
        return suggestedActivity;
      }); 


    })

    $scope.previousState = $scope.currentState = 0;
    $ionicScrollDelegate.scrollTop();
    $scope.title = 'Activity Categories';
    $scope.activityData = activities.categories;
    $scope.nameKey = NAMEKEYS.activityCategoryDisplayName;
    $scope.activityListVisible = true;
    $scope.showActivityForm = false;
    $scope.errorMessage = '';
    $scope.currentActivityUnits = [];
    $scope.newPost = {
      text: ''
    };
    $scope.showNumpad = false;

    _.each($scope.itemStack, function(item) {
      item.currentValue = {};
    });

    $scope.amEditing = false;
    $scope.searchCategoryListVisible = false;
  }
  activities.whenReady()
  .then(function(){ 
      allActivities = _.flatten(_.pluck(activities.categories,'activities'), true);
      resetActivitySelect(); /*initalize view*/
  });
  

  //change the state of the view when the user selects an activity category or activity
  $scope.onItemSelect = function(item) {
    var currentState = $scope.states[$scope.currentState];

    if (currentState) {
      currentState.selectFunction(item);
    }

    $scope.searchCategoryListVisible = false;
  };
  
  $scope.onCategorySelect = function(item) {
    $scope.states[0].selectFunction(item);
    $scope.previousState = 1;
    $scope.searchCategoryListVisible = false;
    $scope.newPost.text = '';
  };

  $scope.backtrackBreadcrumb = function() {
    if ($scope.activityFormPointer) {
      $scope.activityFormPointer.activityForm.$setPristine(true);
    }

    $scope.currentActivityUnits = [];
    
    var currentState = $scope.states[$scope.currentState],
        rootIndex = $scope.currentState - 2;

    if ($scope.newPost.text.length > 0) {
      $scope.currentState = $scope.previousState = 0;
      rootIndex = -1;
    }

    if (rootIndex > -1) {
      var rootState = $scope.states[rootIndex];
      if(rootState.currentValue)
        rootState.selectFunction(rootState.currentValue);
      else{ 
        //for when the the user picks a suguested activity first and clicks back
        resetActivitySelect();
      }

    }
    else {
      resetActivitySelect();
    }
  };

  //user cancels the track activty -> go back to the stream
  $scope.cancel = function() {
    if ($scope.activtyQueue.length > 0) {
      uiConfirmation.prompt({
        destructiveText: 'Discard',
        cancelText: 'Cancel'
      }).then( function(res) {
        switch (res.type) {
          case 'DESTRUCTIVE':
            $scope.createActivityModal.hide();
            resetActivitySelect();
            $scope.activtyQueue = [];
            $scope.addActivityVisible = false;
            break;
          case 'CANCELLED':
            break;
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
    if ($scope.amEditing) {
      var oldIndex = _.indexOf($scope.activtyQueue, $scope.amEditing);
      $scope.activtyQueue.splice(oldIndex, 1, $scope.currentActivity);
    }
    else {
      $scope.activtyQueue.push($scope.currentActivity);
    }
    resetActivitySelect();    
  };

  //save the activity queue and go back to stream if successful, else display an error
  $scope.saveActivities = function() {
    console.log('save called');
    $scope.savingActivty = true;
    activities.logActivities($scope.activtyQueue)
    .then(function(result){
      //streamItems.reload();
      $scope.savingActivty = false;
      $scope.activtyQueue.length = 0;
      Notify.userSuccess("You logged activities!");

      $scope.createActivityModal.hide();

    }, Notify.notifyTheCommonErrors(function(response){
      $scope.savingActivty = false;
      Notify.apiError('Failed to log activities.');
    }));
    console.log('saving complete');
    $scope.closeModalonSubmit(); 
  };

  $scope.closeModalonSubmit = function() {
      $scope.createActivityModal.hide();    
  };

  $scope.restoreActivity = function(item) {
    $scope.amEditing = item;
    $scope.states[1].selectFunction(item);
  }

  //load a suggested activity into the track activity form
  $scope.addSuggestedActivity = function(item){
   
   var activity = _.find(allActivities,{activityName:item.activityDisplayName});
   activity.quantity = item.quantity;
   activity.selectedUnit = _.find(activity.activityUnits,{unitId:item.activityUnitId});
   $scope.states[1].selectFunction(activity);
  };

}]);
