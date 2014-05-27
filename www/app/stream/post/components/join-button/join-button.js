'use strict';

angular.module('sproutApp.directives').directive(
  'joinButton',
  ['$log', 'STREAM_CONSTANTS', 'API_CONSTANTS', 'joinService', 'Notify',
    function ($log, STREAM_CONSTANTS, API_CONSTANTS, joinService, Notify) {
      return {
        restrict: 'E',
        templateUrl: 'app/stream/post/components/join-button/join-button.tpl.html',
        scope: {
          hasHeroImg: '=',
          post: '='
        },
        link: function (scope, elem, attrs) {

          scope.pathToImage = joinService.getJoinIconImage(scope.post);


          scope.getCssClass = function(){
            var cssClass = (scope.hasHeroImg)? ' join-btn-hero' : ' join-btn';
            cssClass += (scope.post.viewer.isMember === 1) ? ' sprout-icon-joined' : ' sprout-icon-join';
            return cssClass;
          }


          scope.doAction = function () {
            if (scope.post.viewer.isMember) {
              // don't do anything now, but perhaps leave group
              $log.debug('Unable to do anything for join button');
            } else {
              // subscribe user
              $log.debug('User is going to join some joinable-thing');
              joinService.join(scope.post)
                .then(function (res) {
                  // Refresh the post
                  if (res && res === 'userCanceled'){
                    $log.info('Canceled join group');
                  } else {
                    return scope.post.refresh('joinedGroup');
                  }

                }, function (err) {
                  Notify.apiError('Unable to join group', err)
                })
                .then(function (res) {
                  _handleRefreshUpdate(res);
                }, function (err) {
                  Notify.apiError('Unable to refresh post', err)
                })
              ;
            }
          };

          var _handleRefreshUpdate = function(res){
            /**
             * TODO this is temporary until post.refresh() is fully implemented to update itself
             * TODO in reality, we just need an err handler for post.refresh(), so this success handler can be null.
             */
            if (res === 'joinedGroup') {
              scope.post.viewer.isMember = 1;
            }
          };
        }
      }
    }
  ]
);