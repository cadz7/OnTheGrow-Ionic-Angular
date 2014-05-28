angular.module('sproutApp.data.joinable-stream-item-service', [
  'sproutApp.user',
  'sproutApp.data.challenge',
  'sproutApp.data.event',
  'sproutApp.data.group',
  'sproutApp.util'
])

  .factory('joinableStreamItemService', ['$log', 'challenge', 'group', 'event',
    function ($log, challenge, group, event) {
      var service = {data : {}};



      var _getDetail = function (post) {
        if (post.streamItemTypeSlug === 'challenge') {
          return challenge.getChallengeDetails(post.relatedToId);
        } else if (post.streamItemTypeSlug === 'group') {
          return group.getGroupDetails(post.relatedToId);
        }  else if (post.streamItemTypeSlug === 'event') {
          return event.getEventDetails(post.relatedToId);
        } else {
          $log.error('unable to find details for ', post);
        }
      };

      service.getDetail = function(post){
        console.debug('getDetail called');
        return _getDetail(post)
          .then(function(detail){
            service.data = detail;
            return detail;
          })
      };

      return service;
    }
  ]);