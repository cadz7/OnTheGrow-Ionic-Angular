/*
    This directive enables a form to be located from within a child scope.
    NB: the event propagation should be stopped after consuming it.
 */
angular.module('sproutApp')

.directive('formLocator', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      scope.$emit('app.formLocator.' + attrs['formLocator'], {
        scope: scope,
        element: elem[0]
      });
    }
  }
}])
;