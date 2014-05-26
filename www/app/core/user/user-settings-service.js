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

      return userSettings.data ? util.q.makeResolvedPromise(userSettings.data) : util.q.makeRejectedPromise();
    };
    
    userSettings.fetchSettings().then(function() {
      /* retrieved settings */
    }, function() {
      // Set defaults
      userSettings.data = {
        autoPostActivities: false,
        remindNotifications: false,
        rememberMe: true
      };

      userSettings.saveSettings(); // this will get called when the watcher is set initially too
    });

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

    return userSettings;
  }
]);