'use strict';

angular.module('sproutApp.directives').directive(
  'streamInModal',
  ['$log', 'STREAM_CONSTANTS', 'API_CONSTANTS', 'streamItems', 'Notify', 'streamItemRenderer',
    function ($log, STREAM_CONSTANTS, API_CONSTANTS, streamItems, Notify, streamItemRenderer) {
      return {
        restrict: 'E',
        scope: {
          streamItemId: '='
        },
        link: function (scope, elem, attrs) {
          var streamItem = streamItems.getStreamItemById(scope.streamItemId)[0];
          streamItemRenderer.render(streamItem)
            .then(function(html){
              elem.html(html);
            }, $log.error);
        }
      }
    }
  ]
);