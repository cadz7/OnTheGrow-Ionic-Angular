/* global angular, window */

angular.module('sproutApp.template', [])

// Processes Sprout templates.
.factory('template', [
  function() {
    var service = {};

    /**
     * Fills a template with values.
     *
     * @param  {String} template       A template string.
     * @param  {Object} data           An object with values.
     * @return {String}                The filled string.
     */
    service.fill = function(template, data) {

      function fillValue(match, matchedKey) {
        var keys = matchedKey.split('.');
        var value = data;
        keys.forEach(function(key) {
          value = value[key];
        });
        return value;
      }

      return template.replace(/{([a-zA-Z0-9\.]+)}/g, fillValue);
    };

    return service;
  }
]);