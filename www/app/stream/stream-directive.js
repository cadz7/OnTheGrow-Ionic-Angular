'use strict';

angular.module('sproutApp.stream-directive', [
  'sproutApp.stream-item-scroller'
])

.directive('stream', ['streamItemScroller',
  function (streamItemScroller) {

    var directive = {
      restrict: 'E',
      // replace: true,
      // scope: {}
    };

    var placeholderHtml;

    directive.link = function linkStreamDirective (scope, iElement, iAttrs) {
      console.log('loading the directive');
      streamItemScroller.init(iElement[0]);
      streamItemScroller.run();
    };


    return directive;
  }
]);