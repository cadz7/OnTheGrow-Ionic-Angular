angular.module('sproutApp.user.storage', [
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
]);