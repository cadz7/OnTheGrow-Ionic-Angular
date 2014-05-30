/**
 * Created by justin on 2014-05-30.
 */

angular.module('sproutApp')
.directive('setFocus', ['$timeout', '$parse', '$log', function($timeout, $parse, $log) {
  return {
    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs) {
      var model = $parse(attrs.setFocus);
      scope.$watch(model, function(value) {
        $log.debug('value=',value);
        if(value === true) {
          $timeout(function() {
            element[0].focus();
          });
        }
      });
      element.bind('blur', function() {
        $log.debug('setFocus-directive: blur()');
        scope.$apply(model.assign(scope, false));
      });
    }
  };
}])
;