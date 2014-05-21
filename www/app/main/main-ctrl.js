angular.module('sproutApp.controllers.main', [
  'sproutApp.network-information'
])

.controller('MainCtrl', ['$scope', 'networkInformation',
  function ($scope, networkInformation) {
    'use strict';

    $scope.keyPress = function(keyCode) {
      if (keyCode===113) { // F2
        if (networkInformation.simulate) {
          networkInformation.simulate.toggleStatus();
        }
      }
    };

  }
]);

