angular.module('sproutApp.data.scores', [
  'sproutApp.user',
  'sproutApp.util'
])

  .factory('scores', ['$log', '$q', 'util','user', 'API_CONSTANTS','mockScoresServer',
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

  .factory('mockScoresServer', ['$q','API_CONSTANTS', function($q,API_CONSTANTS){
    var mockScores = [
                {timePeriodId: 1,score: 2345},
                {timePeriodId: 2,score: 4352},
                {timePeriodId: 3,score: 890},
                {timePeriodId: 4,score: 789},
                {timePeriodId: 5,score: 6879}
              ];


    return {
      get : function(url,query){
        var deferred = $q.defer();
        switch(url){
          case API_CONSTANTS.scoresEndPoint:
            if(query && query.timePeriodId){
              var result = _.filter(mockScores, function(score){return score.timePeriodId === query.timePeriodId;});
              if (typeof result !== 'undefined' && result.length > 0){
                deferred.resolve(result);
              }
              else{
                deferred.resolve(mockScores);
              }
            }
            else
              deferred.resolve(mockScores);
            break;
          default:
            deferred.reject('the mock scores factory received an unexpected url: '+url);
            break;
        }

        return deferred.promise;
      }
    };
  }]);//mockScores