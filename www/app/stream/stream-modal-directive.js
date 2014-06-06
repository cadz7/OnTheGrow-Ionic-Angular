'use strict';

angular.module('sproutApp.directives').directive(
  'streamInModal',
  ['$log', 'STREAM_CONSTANTS', 'API_CONSTANTS', 'streamItems', 'Notify', 'streamItemRenderer', 'streamItemModalService',
    function ($log, STREAM_CONSTANTS, API_CONSTANTS, streamItems, Notify, streamItemRenderer, streamItemModalService) {
      return {
        restrict: 'E',
        scope: {
        },
        link: function (scope, elem, attrs) {
          streamItemRenderer.render(streamItemModalService.getStreamItem())
            .then(function(html){
              elem.html(html);
            }, $log.error);
        }
      }
    }
  ]
);