'use strict';
 
angular.module('sproutApp.directives')
  .directive('numpad', [
 
    function() {
      return {
        restrict: 'E',
        scope: {
          modelObj: '=',
          accept: '&',
          next: '='
        },
        templateUrl: 'app/stream/add-activity-bar/numpad.tpl.html',
        link: function(scope, iElement, iAttrs) {
          // Number key pressed
          scope.update = function(number) {
            if (!scope.modelObj)
              scope.modelObj = '';
            scope.modelObj = parseInt(String(scope.modelObj) + number);
          };
          // Backspace
          scope.delete = function() {
            if (!scope.modelObj || scope.modelObj === null)
              return;
            if (String(modelObj).length > 1)
              scope.modelObj = parseInt(String(scope.modelObj).slice(0, String(scope.modelObj).length - 1));
            else
              scope.modelObj = null;
          };          
        }
      };
    }
  ]);