/* global window */

angular.module('sproutApp.user', [
  'sproutApp.util'
])

.factory('userStorage', [

  function () {
    'use strict';
    var service = {};

    service.get = function () {
      return JSON.parse(window.localStorage.getItem('user'));
    };

    service.set = function (user) {
      return window.localStorage.setItem('user', JSON.stringify(user));
    };

    service.removeUser = function () {
      return window.localStorage.removeItem('user');
    };

    return service;
  }
])

.factory('user', ['userStorage', '$q', '$log', '$window', 'util',
  function (userStorage, $q, $log, $window, util) {
    'use strict';
    var user = {};
    var authenticatedDeferred = $q.defer();

    var arthur = {
      userId: 42,
      firstName: 'Arthur',
      lastName: 'Dent'
    };

    user.isAuthenticated = false; // Shows whether the user is authenticated.

    function getUserStatus() {
      user.data = userStorage.get();
      if (_.isObject(user.data) && user.data.userId) {
        user.isAuthenticated = true;
        authenticatedDeferred.resolve();
      }
      return user.data;
    }

    user.whenAuthenticated = function () {
      return authenticatedDeferred.promise;
    };

    user.login = function (username, password) {
      $log.info('Simulating login:', username);
      if (username === 'arthur') {
        user.data = arthur;
        user.isAuthenticated = true;
        userStorage.set(arthur);
        authenticatedDeferred.resolve();
        return util.q.makeResolvedPromise();
      } else {
        return util.q.makeRejectedPromise({
          errorCode: 'wrong-password',
          errorMessage: 'Wrong username or password.'
        });
      }
    };

    user.logout = function () {
      user.isAuthenticated = false;
      userStorage.removeUser();
      $window.location.replace('/');
    };

    function init() {
      getUserStatus();
    }

    user.testing = {
      reload: function () {
        init();
      }
    };

    init();

    return user;
  }
]);