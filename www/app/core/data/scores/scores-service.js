angular.module('sproutApp.data.scores', [
  'sproutApp.user',
  'sproutApp.util'
])

  .factory('scores', ['$log', '$q', 'util','user', 'API_CONSTANTS','mockScores',
    function ($log, $q, util, user, API_CONSTANTS, server) {
      var service = {};

      /*
      *  Gets the scores for the current user
      * @param {int, optional} timePeriodId id of the selected timeperiod to return scores for  
      *
      * @return {promise}   a promise that resolves to the current user's scores
      */
      service.getScoresForUser = function (timePeriodId) {
        if (!user.isAuthenticated) {
          return util.q.makeRejectedPromise('Must be authenticated');
        }
        
        return server.get(API_CONSTANTS.scoresEndPoint,{timePeriodId:timePeriodId});
      };//getScoresForUser

      return service;
    }
  ])//scores

  .factory('mockScores', ['$q','API_CONSTANTS', function($q,API_CONSTANTS){
    return {
      get : function(url,query){
        var deferred = $q.defer();
        switch(url){
          case API_CONSTANTS.scoresEndPoint:
            deferred.resolve([
                {timePeriodId: 2,score: 2345},
                {timePeriodId: 3,score: 4352},
                {timePeriodId: 4,score: 890},
                {timePeriodId: 5,score: 789},
                {timePeriodId: 6,score: 6879},
                {timePeriodId: 7,score: 5768},
                {timePeriodId: 8,score: 4675},
                {timePeriodId: 9,score: 3546},
                {timePeriodId: 10,score: 234},
                {timePeriodId: 11,score: 1234}
              ]);
            break;
          default:
            deferred.reject('the mock scores factory received an unexpected url: '+url);
            break;
        }

        return deferred.promise;
      }
    };
  }]);//mockScores