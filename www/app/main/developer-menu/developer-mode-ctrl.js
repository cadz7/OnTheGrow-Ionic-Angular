/**
 * Created by justin on 2014-05-28.
 */

angular.module('sproutApp')

.controller('DeveloperCtrl', ['$scope', 'networkInformation','user','$state', 'streamItems', 'streamItemsCache', '$log', 'Notify',
  function ($scope, networkInformation,user,$state, streamItems, streamItemsCache, $log, Notify) {
    'use strict';
    $scope.user = user;

    //logs out user and reloads the page
    $scope.logout = function(){
      user.logout();
    };

    function updateConnectionStatus() {
      $scope.status = networkInformation.isOnline ? 'online' : 'offline'
    }

    $scope.toggleOffline = function() {
      if (networkInformation.simulate) {
        networkInformation.simulate.toggleStatus();
      }
      updateConnectionStatus();
    };

    $scope.reloadStreams = function() {
      Notify.userSuccess('Streams reloaded.');
      streamItems.reload();
    };

    $scope.clearStreamCache = function() {
      Notify.userSuccess('Cache cleared.');
      streamItemsCache.clear();
      streamItemsCache.initialize();
    };

    updateConnectionStatus();

    networkInformation.onOnline(function() {
      $scope.$apply(updateConnectionStatus);
    });
    networkInformation.onOffline(function() {
      $scope.$apply(updateConnectionStatus);
    });

    $scope.log = $log.messages;
  }
]);