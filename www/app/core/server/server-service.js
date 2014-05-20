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
    }

    service.get = function() {
      // Will call $http with the right options and headers.
    };

    service.post = function() {
      // Will call $http with the right options and headers.
    };    

    service.put = function() {
      // Will call $http with the right options and headers.
    };

    service.delete = function() {
      // Will call $http with the right options and headers.
    };

    service.onConnection = function(callback) {
      // Adds callback to an array of functions to call when
      // network connection becomes available.
    };

    return service;
  }
]);