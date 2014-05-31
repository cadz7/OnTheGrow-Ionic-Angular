/**
 * Created by justin on 2014-05-30.
 */

angular.module('sproutApp')

.directive('focusMe', ['$timeout', '$log', function($timeout, $log) {
  return {
    link: function(scope, element, attrs) {
      // timeout is necessary sometimes if there is an animation etc...
      $timeout(function() {
        element[0].focus();
        if (attrs['focusMe'] === 'showKeyboard') {
          SoftKeyboard.show();
        }
      });
    }
  };
}])
;