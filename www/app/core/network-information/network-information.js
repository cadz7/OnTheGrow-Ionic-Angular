/* globals Connection */

angular.module('sproutApp.network-information', [
])

.factory('networkInformation', ['$log', 'Notify',

  function ($log, Notify) {
    'use strict';

    var service = {
      simulate: {},
      isOnline: true
    };

    var listeners = {
      online: [],
      offline: []
    };

    service.simulate.setStatus = function(newValue) {
      var oldValue = service.isOnline;
      service.isOnline = newValue;
      if (newValue && !oldValue) {
        $log.log('Now simulating online.');
        service.setOnline();
      } else if (oldValue && !newValue) {
        $log.log('Now simulating offline.');
        service.setOffline();
      }
    }

    service.simulate.toggleStatus = function() {
      if (service.isOnline) {
        service.simulate.setStatus(false);
      } else {
        service.simulate.setStatus(true);
      }
    };

    service.setOnline = function() {
      if (!service.isOnline) {
        $log.log('Device is online.');
        service.isOnline = true;
        fire('online');
      }
    };

    service.setOffline = function() {
      if (service.isOnline) {
        Notify.warn('Sprout has entered offline mode.  You can still track your activities in offline mode but most other features are disabled.', 'Network Connection Lost!');
        $log.log('Device is offline.');
        service.isOnline = false;
        fire('offline');
      }
    };

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