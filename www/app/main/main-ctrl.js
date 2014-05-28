angular.module('sproutApp.controllers.main', [
  'sproutApp.network-information'
])

.controller('MainCtrl', ['$scope', 'networkInformation','user','$state',
  function ($scope, networkInformation,user,$state) {
    'use strict';
    $scope.user = user;
    
    //logs out user and reloads the page
    $scope.logout = function(){
      user.logout();
    }

    $scope.simulateOffline = function() {
      if (networkInformation.simulate) {
        networkInformation.simulate.toggleStatus();
      }
    };
  }
]);

