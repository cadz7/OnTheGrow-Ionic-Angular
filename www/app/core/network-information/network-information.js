/* globals Connection */

angular.module('sproutApp.network-information', [
])

.factory('networkInformation', [

  function () {
    'use strict';

    var service = {
      simulate: {}
    };

    var listeners = {
      online: [],
      offline: []
    };

    function isOnline() {
      console.log('connection', navigator.connection, Connection.NONE);
      return navigator.connection.type !== Connection.NONE;
    }

    if (service.simulate) {
      service.isOnline = true;
    } else {
      service.isOnline = isOnline();      
    }

    service.simulate.setStatus = function(newValue) {
      var oldValue = service.isOnline;
      service.isOnline = newValue;
      if (newValue && !oldValue) {
        console.log('Now simulating online.');
        fire('online');
      } else if (oldValue && !newValue) {
        console.log('Now simulating offline.');
        fire('offline');
      }
    }

    service.simulate.toggleStatus = function() {
      if (service.isOnline) {
        service.simulate.setStatus(false);
      } else {
        service.simulate.setStatus(true);
      }
    }

    function fire(event) {
      listeners[event].forEach(function(listener) {
        listener();
      });
    };

    service.onOnline = function(listener) {
      listeners.online.push(listener);
    };

    service.onOffline = function(listener) {
      listeners.offline.push(listener);
    };

    return service;
  }
]);