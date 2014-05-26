angular.module('sproutApp.user.storage', [
])

.factory('userStorage', [

  function () {
    'use strict';
    var service = {};

    service.get = function (key) {
      return JSON.parse(window.localStorage.getItem(key || 'user'));
    };

    service.set = function (data, key) {
      return window.localStorage.setItem(key || 'user', JSON.stringify(data));
    };

    service.removeUser = function () {
      return window.localStorage.removeItem('user');
    };

    return service;
  }
]);