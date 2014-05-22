'use strict';

angular.module('sproutApp.directives').directive(
  'joinButton',
  ['$log', 'STREAM_CONSTANTS', 'API_CONSTANTS',
    function ($log, STREAM_CONSTANTS, API_CONSTANTS) {
      return {
        restrict: 'E',
        templateUrl: 'app/stream/post/components/join-button/join-button.tpl.html',
        scope: {
          hasHeroImg: '=',
          post: '='
        },
        link: function (scope, elem, attrs) {

          scope.pathToImage = scope.post.viewer.isMember ? 'img/icons/join-confirm-icon.svg' : 'img/icons/join-icon.svg';

          scope.doAction = function(){
            if (scope.post.viewer.isMember){
              // don't do anything now, but perhaps leave group
              $log.debug('Unable to do anything for join button')
            } else {
              // subscribe user
              $log.debug('User is going to join some joinable-thing');

            }
          }
        }
      }
    }
  ]
);