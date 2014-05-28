/**
 * Created by justin on 2014-05-28.
 */

angular.module('sproutApp')

.controller('DeveloperCtrl', ['$scope', 'networkInformation','user','$state', 'streamItems',
  function ($scope, networkInformation,user,$state, streamItems) {
    'use strict';
    $scope.user = user;

    //logs out user and reloads the page
    $scope.logout = function(){
      user.logout();
    };

    $scope.toggleOffline = function() {
      if (networkInformation.simulate) {
        networkInformation.simulate.toggleStatus();
      }
      $scope.status = networkInformation.isOnline ? 'online' : 'offline'
    };

    $scope.reloadStreams = function() {
      streamItems.reload();
    };

    $scope.status = networkInformation.isOnline ? 'online' : 'offline';
  }
]);