'use strict';
 
angular.module('sproutApp.directives')
  .directive('numpad', [
 
    function() {
      return {
        restrict: 'E',
        scope: {
          model: '=',
          accept: '&',
          next: '='
        },
        templateUrl: 'app/stream/add-activity-bar/numpad.tpl.html',
        link: function(scope, iElement, iAttrs) {
          // Number key pressed
          scope.update = function(number) {
            if (typeof scope.model === 'undefined' || !scope.model)
              scope.model = '';
            scope.model = parseInt(String(scope.model) + number);
          };
          // Backspace
          scope.delete = function() {
            if (!scope.model || scope.model === null)
              return;
            if (String(scope.model).length > 1)
              scope.model = parseInt(String(scope.model).slice(0, String(scope.model).length - 1));
            else
              scope.model = null;
          };          
        }
      };
    }
  ]);