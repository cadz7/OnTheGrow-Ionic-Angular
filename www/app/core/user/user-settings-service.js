/* global window */
angular.module('sproutApp.user-settings', [
  'sproutApp.user.storage',
  'sproutApp.user'
])

.factory('userSettings', ['userStorage', 'util', '$q',
  function (userStorage, util, $q) {
    'use strict';
    
    var userSettings = {};

    userSettings.fetchSettings = function() {
      userSettings.data = userStorage.get('settings');

      return userSettings.data ? util.q.makeResolvedPromise(userSettings.data) : initializeSettings();
    };

    userSettings.saveSettings = function() {
      userStorage.set(userSettings.data, 'settings');
      return util.q.makeResolvedPromise(userSettings.data);
    };
    
    userSettings.saveSetting = function(key, value) {
      var deferred = $q.defer();

      if (key in userSettings.data) {
        userSettings.data[key] = value;
        userStorage.set(userSettings.data, 'settings');
        deferred.resolve(userSettings.data);
      }
      else {
        deferred.reject("Unable to save setting: '" + key + "' key was not found");
      }

      return deferred.promise;
    };
    
    function initializeSettings() {
      var deferred = $q.defer();

      userSettings.data = {
        autoPostActivities: false,
        remindNotifications: false,
        rememberMe: true
      };

      userSettings.saveSettings().then(function() {
        deferred.resolve('saved new settings');
      }, function(error) {
        deferred.reject('Error saving new settings');
      });

      return deferred.promise;
    }
    
    userSettings.fetchSettings().then(function() {
      /* retrieved settings */
    }, function() {
      // Set defaults
      return initializeSettings();
    });

    return userSettings;
  }
]);