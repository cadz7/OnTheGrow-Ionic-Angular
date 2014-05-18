angular.module('sproutApp.util', [])

// Generic util methods.

.factory('util', ['$q',
  function ($q) {
    'use strict';
    var service = {};

    service.q = {};
    service.q.makeResolvedPromise = function (value) {
      var deferred = $q.defer();
      deferred.resolve(value);
      return deferred.promise;
    };

    service.q.makeRejectedPromise = function (error) {
      var deferred = $q.defer();
      deferred.reject(error);
      return deferred.promise;
    };

    return service;
  }
]);