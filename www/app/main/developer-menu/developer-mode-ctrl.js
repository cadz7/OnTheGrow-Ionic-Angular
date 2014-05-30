/**
 * Created by justin on 2014-05-28.
 */

angular.module('sproutApp')

.controller('DeveloperCtrl', ['$scope', 'networkInformation','user','$state', 'streamItems', 'streamItemsCache', '$log',
  function ($scope, networkInformation,user,$state, streamItems, streamItemsCache, $log) {
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

    $scope.clearStreamCache = function() {
      streamItemsCache.clear();
      streamItemsCache.initialize();
    };

    $scope.status = networkInformation.isOnline ? 'online' : 'offline';

    $scope.log = $log.messages;
  }
]);