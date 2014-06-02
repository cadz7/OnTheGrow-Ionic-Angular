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

.directive('showKeyboard', ['$timeout', '$log', function($timeout, $log) {
  function showKeyboard() {
    $timeout(function() {
      // timeout is necessary sometimes if there is an animation etc...
      SoftKeyboard.show();
    },100);
  }

  return {
    link: function (scope, element, attrs) {
      if (attrs['showKeyboard']) {
        element.bind(attrs['showKeyboard'], showKeyboard);
      } else {
        element.bind('focus', showKeyboard);
      }
    }
  };
}])
;