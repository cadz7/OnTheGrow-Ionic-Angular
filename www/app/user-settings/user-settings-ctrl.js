angular.module('sproutApp.controllers.user-settings', [])

.controller('UserSettingsCtrl', ['$scope', 'userSettings', '$log', 'userStorage','user',
  function ($scope, userSettings, $log, userStorage, user) {
    'use strict';

    $scope.userSettings = userSettings.data;

    $scope.$watchCollection('userSettings', function(oldVal, newVal) {
      userSettings.saveSettings().then(function() {
        /*Settings were saved*/   

        //if the user changes 'keep me signed in', we need to update the user in local storage accordingly
        if(newVal.rememberMe){
          //add the user to localstorage
          userStorage.set(user.data,'user');
        }else if (! newVal.rememberMe){
          userStorage.removeUser();          
        }
     
      })
      .then(null,$log.error);      
    });

  }
]);

