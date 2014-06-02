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

      service.joinChallenge = function (relatedToId, groupId) {
        logAction('challenge', relatedToId, groupId);

        // TODO confirm params with API (js)
        var params = {
          groupId: groupId
        };

        return server.post(API_CONSTANTS.challengesMembershipEndpoint + '/' + relatedToId, params);
      };


      service.joinEvent = function (relatedToId, groupId) {
        logAction('event', relatedToId, groupId);
        return server.post(API_CONSTANTS.eventsMembershipEndpoint + '/' + relatedToId);
      };

      service.joinGroup = function (relatedToId, groupId) {
        logAction('group', relatedToId, groupId);
        return server.post(API_CONSTANTS.groupsMembershipEndpoint + '/' + relatedToId);
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