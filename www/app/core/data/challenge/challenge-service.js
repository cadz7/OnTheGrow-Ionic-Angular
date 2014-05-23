angular.module('sproutApp.data.challenge', [
  'sproutApp.user',
  'sproutApp.util'
])

  .factory('challenge', ['$log', '$q', 'user', 'util',
    function ($log, $q, user, util) {
      var service = {};

      var mockChallengeDetailData = {
        challengeName: 'someChallengeName',
        challengeDescription: 'someChallengeDescription'

      };

      service.getChallengeDetails = function (challengeId) {
        if (challengeId > 1) {
          return util.q.makeResolvedPromise(mockChallengeDetailData);
        } else {
          return util.q.makeRejectedPromise('error');
        }
      };

      return service;
    }
  ]);