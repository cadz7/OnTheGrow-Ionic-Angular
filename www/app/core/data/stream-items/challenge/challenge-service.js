angular.module('sproutApp.data.challenge', [
  'sproutApp.user',
  'sproutApp.util'
])

  .factory('challenge', ['$log', '$q', 'user', 'util', 'API_CONSTANTS', 'mockChallengeServer',
    function ($log, $q, user, util, API_CONSTANTS, server) {
      var service = {};


      service.getChallengeDetails = function (challengeId) {
        return server.get(API_CONSTANTS.challengesEndpoint + '/' + challengeId);
      };

      return service;
    }
  ])
  .factory('mockChallengeServer', ['$q', 'util', 'API_CONSTANTS', '$log',
    function ($q, utils, API_CONSTANTS, $log) {
      'use strict';

      var mockChallengeDetailData = {
        challengeId: 666,
        challengeName: 'Bike to work',
        challengeDescription: 'Bike to work for a week',
        challengeInstruction: 'Ride your bike to work from home, and back for a week',
        challengeImageURL: 'app/stream/post/joinable/components/detail/sample-images/biketowork.jpg',
        challengeType: 'someType',
        challengeDeadline: new Date(),
        numChallengeParticipants: 42,
        challengeParticipants: {}
      };


      return {
        get: function (url, query) {
          $log.debug('called mock challenge service ' + url, query)
          var deferred = $q.defer();
          deferred.resolve(mockChallengeDetailData);
          return deferred.promise;
        }
      };
    }
  ])
;