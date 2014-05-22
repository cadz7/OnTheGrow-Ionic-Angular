'use strict';

angular.module('sproutApp.directives').directive(
  'joinButton',
  ['$log', 'STREAM_CONSTANTS', 'API_CONSTANTS', 'joinService',
    function ($log, STREAM_CONSTANTS, API_CONSTANTS, joinService) {
      return {
        restrict: 'E',
        templateUrl: 'app/stream/post/components/join-button/join-button.tpl.html',
        scope: {
          hasHeroImg: '=',
          post: '='
        },
        link: function (scope, elem, attrs) {

          scope.pathToImage = joinService.getJoinIconImage(scope.post);

          scope.doAction = function () {
            if (scope.post.viewer.isMember) {
              // don't do anything now, but perhaps leave group
              $log.debug('Unable to do anything for join button');
            } else {
              // subscribe user
              $log.debug('User is going to join some joinable-thing');
              joinService.join(scope.post)
                .then(function (res) {
                  return scope.post.refresh('joinedGroup');
                }, function (err) {
                  // TODO handle error when trying to join
                })
                .then(function (res) {
                  if (res === 'joinedGroup') {
                    scope.post.viewer.isMember = 1;
                    //scope.pathToImage = 'img/icons/join-confirm-icon.svg';
                  }
                }, function (err) {
                  // TODO handle error on refresh post
                })
              ;
            }
          }
        }
      }
    }
  ]
);