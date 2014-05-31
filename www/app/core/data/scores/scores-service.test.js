/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('scores service', function () {
  var mockData = {};
  var scores,apiRoots;

  // Load the module
  beforeEach(module('sproutApp.data.scores'));

  // Provide mocks
  beforeEach(module(function ($provide) {
    $provide.factory('$q', function () {
      return Q;
    });
    $provide.factory('user', function () {
      return {
        data: {},
        login: function() {
          var deferred = Q.defer();
          this.isAuthenticated = true;
          this.data = {
            userId: 42,
            firstDisplayName: 'Arthur',
            lastDisplayName: 'Dent'
          };
          deferred.resolve();
          return deferred.promise;
        }
      };
    });
    $provide.factory('server',function(){
      return {
        get : function(url,params){
          var deferred = Q.defer();

          switch(url){
            case  apiRoots.scoresEndPoint:
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
              deferred.reject(new Error('unexpected url: '+url))
            break;
          }
          return deferred.promise;
        }//GET
      }
    });//server
  }));

  // Reset mock data;
  beforeEach(function () {
    mockData = {};
    scores = testUtils.getService('scores');
  });

  beforeEach(inject(function($injector) {
    apiRoots = $injector.get('API_CONSTANTS'); 
  }));

  it('should get loaded and have getScoresForUser()', function () {    
    expect(scores).to.not.be.undefined;
    expect(scores).itself.to.respondTo('getScoresForUser');
  });

  it('should return an array of scores for authenicated users',function(done){
    var user = testUtils.getService('user');
    return user.login('arthur')
        .then(function() {
          scores.getScoresForUser().then(function(scores){
          expect(scores).to.not.be.undefined;
          expect(scores).to.be.instanceof(Array);
          expect(scores[0]).to.have.property('score');
          expect(scores[0]).to.have.property('timePeriodId');
          done();
        },done);
      });
  });

  it('should reject the promise if the user is not authenicated',function(done){
    scores.getScoresForUser().then(function(){
      done(new Error('promise should be rejected'));
    },function(error){
      expect(error).to.not.be.undefined;
      done();
    });
  });

});//scores service