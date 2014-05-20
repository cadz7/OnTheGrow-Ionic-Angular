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
        var result;
        keys.forEach(function(key) {
          if (!value) {
            throw new Error('No matching value for key:', matchedKey);
          }
          value = value[key];
        });
        return value;
      }

      result = template.replace(/{([a-zA-Z0-9\.]+)}/g, fillValue);
      return result.replace('\\}', '}').replace('\\{', '{');
    };

    return service;
  }
]);