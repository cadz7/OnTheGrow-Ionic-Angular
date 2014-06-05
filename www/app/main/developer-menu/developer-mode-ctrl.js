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

    function localStorageTest() {
      var streamItems = createMockStreamItems(0, 5000);
      chai.expect(streamItems.length).to.be.equal(5001);
      streamItemsCache.update(0, streamItems, null);

      var items = streamItemsCache.getItems(0, 0, 5000);
      chai.expect(items.length).to.be.equal(5000);

      // if we get here that means chai didn't throw any exceptions
      $log.debug('Local Storage Test Passed.  5000 items stored.  Here is item at index 2132:', items[2132]);
    }

    $scope.localStorageTest = localStorageTest;
    $scope.log = $log.messages;
  }
]);

function addDays(date, days) {
  return new Date (
      date.getFullYear(),
      date.getMonth(),
      (date.getDate()+days)
  );
}

function createMockStreamItems(startId, endId, startDate) {
  startDate = startDate || new Date();

  var streamItems = [];
  var count = 0;
  while (startId <= endId) {
    streamItems.push(
        {
          streamItemId: startId,
          content: 'test ' + count + 'hello I like to walk in the park and enjoy things that smell good because I like greenery and tall trees and sunshine and air and water and I like wood and rocks and gardens and snow and I like dirt and pebbles and gemstones too, I like crystals and leaves and diamonds and gold and I love it all because it is all so wonderful!',
          dateTimeCreated: addDays(startDate, count)
        });
    count++;
    startId++;
  }
  return streamItems;
}