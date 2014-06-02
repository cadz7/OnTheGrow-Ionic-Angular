angular.module('sproutApp.data.joinable-stream-item-service', [
  'sproutApp.user',
  'sproutApp.data.challenge',
  'sproutApp.data.event',
  'sproutApp.data.group',
  'sproutApp.util'
])

  .factory('joinableStreamItemService', ['$log', 'challenge', 'group', 'event', '$q',
    function ($log, challenge, group, event, $q) {
      var service = {data : {}};



      var _getDetail = function (post) {
        if (post.relationTypeSlug === 'challenge') {
          return challenge.getChallengeDetails(post.relatedToId);
        } else if (post.relationTypeSlug === 'group') {
          return group.getGroupDetails(post.relatedToId);
        }  else if (post.relationTypeSlug === 'event') {
          return event.getEventDetails(post.relatedToId);
        } else {
          $log.debug('unable to find details for ', post);
          var deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        }
      };

      /**
       * Details are persisted in this service, on top
       * of being resolved in the returned promise.
       *
       * @param post
       * @returns {*}
       */
      service.getDetail = function(post){
        service.data = {};

        return _getDetail(post)
          .then(function(detail){
            service.data = detail;
            return detail;
          })
      };

      return service;
    }
  ]);