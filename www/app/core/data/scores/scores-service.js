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
                {timePeriodId: 'today',score: 2345},
                {timePeriodId: 'yesterday',score: 4352},
                {timePeriodId: 'week',score: 890},
                {timePeriodId: 'month',score: 789},
                {timePeriodId: 'year',score: 6879}
              ];


    return {
      get : function(url,query){
        var deferred = $q.defer();
        switch(url){
          case API_CONSTANTS.scoresEndPoint:
            if(query && query.timePeriodId)
              deferred.resolve(_.filter(mockScores, function(score){return score.timePeriodId === query.timePeriodId;}));
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