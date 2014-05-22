/* global angular, window */

angular.module('sproutApp.server', [
  'sproutApp.util'
])

// Abstracts interaction with the sprout API server. This service does not do
// any caching - that should be taken care of at the higher level. It does,
// however, check connection status before making calls. It also reports
// connection status to the higher level services.
.factory('server', ['util', '$log',
  function(util, $log) {
    var service = {};

    service.isReachable = true;

    var user = {
      userId: 42,
      firstName: 'Arthur',
      lastName: 'Dent',
      token: 'e9c77174292c076359b069aef68468d1463845cf',
      expirationDateTime: '2014-07-14T15:22:11Z'
    };

    service.login = function(username, password) {
      $log.info('Simulating login:', username);

      if (username === 'arthur') {
        return util.q.makeResolvedPromise(user);
      } else {
        return util.q.makeRejectedPromise({
          errorCode: 'wrong-password',
          errorMessage: 'Wrong username or password.'
        });
      }
    };

//  service.get('/streamitems/89')

    var offline = true;
    service.get = function() {
      if (offline) {
        return util.q.makeRejectedPromise('offline');
      }
      // Will call $http with the right options and headers.
      return util.q.makeResolvedPromise(true);
    };

    service.post = function(endpoint, args) {
      if (offline) {
        return util.q.makeRejectedPromise('offline');
      }
      // Will call $http with the right options and headers.
      return util.q.makeResolvedPromise(args);
    };    

    service.put = function() {
      // Will call $http with the right options and headers.
      return util.q.makeResolvedPromise(true);
    };

    service.delete = function() {
      // Will call $http with the right options and headers.
      return util.q.makeResolvedPromise(true);
    };

    var callbacks = [];
    service.onConnection = function(callback) {
      // Adds callback to an array of functions to call when
      // network connection becomes available.
      callbacks.push(callback);
    };

    service.connected = function() {
      callbacks.forEach(function(cb) {
        cb();
      });
    };

    return service;
  }
]);