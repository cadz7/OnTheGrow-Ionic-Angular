/* global angular, window */

angular.module('sproutApp.data.template-parser', [])

.factory('templateParser', [
  function() {
    var templateParser = {};

    templateParser.parse = function(template, data) {
      // this is probably brittle and non-performant!
      return _.template(template)(data);
    };

    return templateParser;
  }
]);