angular.module('sproutApp.controllers.user-settings', [])

.controller('UserSettingsCtrl', ['$scope', 'userSettings', '$log',
  function ($scope, userSettings, $log) {
    'use strict';

    $scope.userSettings = userSettings.data;

    $scope.$watchCollection('userSettings', function(oldVal, newVal) {
      userSettings.saveSettings().then(function() {
        /*Settings were saved*/
      }, function(error) {
        /*there was an error*/
        $log.error(error);
      });
    });

  }
]);

