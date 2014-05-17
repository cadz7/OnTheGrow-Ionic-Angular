/* global angular, window */

angular.module('sproutApp.user', [

])

.factory('userStorage', [
  function() {
    var service = {};

    service.get = function() {
      return window.localStorage.getItem('user');
    };

    service.set = function(user) {
      return window.localStorage.setItem('user', user);
    }

    return service;
  }
])

.factory('user', ['userStorage', '$q', '$log', '$window',
  function(userStorage, $q, $log, $window) {
    'use strict';
    var user = {};
    var authenticatedDeferred = $q.defer();

    var arthur = {
      userId: 42,
      firstName: 'Arthur',
      lastName: 'Dent'
    };

    function makeResolvedPromise(value) {
      var deferred = $q.defer();
      deferred.resolve(value);
      return deferred.promise;
    }

    function makeRejectedPromise(error) {
      var deferred = $q.defer();
      deferred.reject(error);
      return deferred.promise;
    }    

    user.isAuthenticated = false; // Shows whether the user is authenticated.

    function getUserStatus() {
      user.data = userStorage.get();
      if (user.data) {
        user.isAuthenticated = true;
        authenticatedDeferred.resolve();
      }
      return user.data;
    }

    user.whenAuthenticated = function() {
      return authenticatedDeferred.promise;
    };

    user.login = function (username, password) {
      $log.info('Simulating login:', username);
      if (username==='arthur') {
        user.data = arthur;
        userStorage.set('user', arthur);
        authenticatedDeferred.resolve();
        return makeResolvedPromise();
      } else {
        return makeRejectedPromise({
          errorCode: 'wrong-password',
          errorMessage: 'Wrong username or password.'
        });
      }
    };

    user.logout = function () {
      userStorage.set('user', null);
      $window.location.replace('/');
    };

    function init () {
      getUserStatus();
    }

    user.testing = {
      reload: function() {
        init();
      }
    };

    init();

    return user;
  }
]);
