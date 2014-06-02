angular.module('sproutApp.data.membership', [
  'sproutApp.user',
  'sproutApp.util'
])

  .factory('membership', ['$log', '$q', 'user', 'util', 'mockMembershipServer', 'API_CONSTANTS',
    function ($log, $q, user, util, server, API_CONSTANTS) {
      var service = {};

      function logAction(type, id, groupId) {
        $log.debug('joining ' + type + ' #' + id + ' with group #' + groupId);
      }

      service.joinChallenge = function (id, groupId) {
        logAction('challenge', id, groupId);

        // TODO confirm params with API (js)
        var params = {
          id: id,
          groupId: groupId
        };

        return server.post(API_CONSTANTS.challengesMembershipEndpoint, params);
      };


      service.joinEvent = function (id, groupId) {
        logAction('event', id, groupId);
        return server.post(API_CONSTANTS.eventsMembershipEndpoint, {id: id});
      };

      service.joinGroup = function (id, groupId) {
        logAction('group', id, groupId);
        return server.post(API_CONSTANTS.groupsMembershipEndpoint, {id: id});
      };

      var errorHandler = function(post){
        return util.q.makeRejectedPromise('error unable to find method for post type ' + post.relationTypeSlug);
      };

      var postTypeToJoinFunc = {
        'challenge' : service.joinChallenge,
        'group' : service.joinGroup,
        'event' : service.joinEvent
      };

      service.join = function (post, groupId) {
        if (postTypeToJoinFunc[post.relationTypeSlug]){
          return postTypeToJoinFunc[post.relationTypeSlug](post.relatedToId, groupId);
        } else {
          return errorHandler(post);
        }
      };

      return service;
    }
  ])
  .factory('mockMembershipServer', ['$q', 'util', 'API_CONSTANTS', '$log',
    function ($q, utils, API_CONSTANTS, $log) {
      'use strict';

      return {
        post: function (url, query) {
          $log.debug('called mockMembershipServer challenge service ' + url, query)
          var deferred = $q.defer();
          deferred.resolve('success');
          return deferred.promise;
        }
      };
    }
  ])
;