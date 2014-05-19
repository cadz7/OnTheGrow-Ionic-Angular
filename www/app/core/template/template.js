/* global angular, window */

angular.module('sproutApp.template', [])

.factory('template', [
  function() {
    var template = {};

    template.fill = function(templ, data) {
      // this is probably brittle and non-performant!
      return _.template(templ)(data);
    };

    return template;
  }
]);