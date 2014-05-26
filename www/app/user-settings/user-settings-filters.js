/* global window */
'use strict';

angular.module('sproutApp.filters')

.filter('userSettingsMapper', ['userSettings',
  function (userSettings) {
    return function(setting) {
      return userSettings.mapSettingText[setting] || '';
    }
  }
]);
