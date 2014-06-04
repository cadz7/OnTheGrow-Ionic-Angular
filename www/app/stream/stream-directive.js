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

    window.handleSproutStreamScrollerClick = function(id, action) {
      alert(action + ': ' + id);
    };

    directive.link = function linkStreamDirective (scope, iElement, iAttrs) {
      console.log('loading the directive');
      streamItemScroller.init(iElement[0]);
      streamItemScroller.run();
    };


    return directive;
  }
]);