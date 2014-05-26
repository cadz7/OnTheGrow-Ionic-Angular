/* global window */
angular.module('sproutApp.user-settings', [
  'sproutApp.user.storage',
  'sproutApp.user'
])

.factory('userSettings', ['userStorage', 'util',
  function (userStorage, util) {
    'use strict';
    
    var userSettings = {},
        settingTextMapper = { // TODO: fetch this from somewhere?
          'autoPostActivities': 'Auto-post activities',
          'remindNotifications': 'Remind me to track activities',
          'rememberMe': 'Keep me signed in'
        };

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

    userSettings.mapSettingText = function(setting) {
      return settingTextMapper[setting] || "";
    }

    return userSettings;
  }
]);