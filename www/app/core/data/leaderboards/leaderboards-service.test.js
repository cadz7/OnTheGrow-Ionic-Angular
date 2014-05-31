/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('leaderboards service', function() {
  var mockData = {};
  var leaderboards, apiRoots;

  // Load the module
  beforeEach(module('sproutApp.data.leaderboards'));

  // Provide mocks
  beforeEach(module(function($provide) {
    $provide.factory('$q', function() {
      return Q;
    });
    $provide.factory('server', function() {
      return {
        get : function(url,params) {
          var deferred = Q.defer();
          if(url === apiRoots.leaderboards)
            deferred.resolve([]);
          else
            deferred.reject();
          return deferred.promise;
        }
      }
    });
  }));


  // Reset mock data;
  beforeEach(function() {
    mockData = {};
    leaderboards = testUtils.getService('leaderboards');
  });

   beforeEach(inject(function($injector) {
    apiRoots = $injector.get('API_CONSTANTS'); 
  }));

  it('leaderboards service should get loaded', function () {
    var leaderboards = testUtils.getService('leaderboards');
    expect(leaderboards).to.not.be.undefined;
  });
  
  it('should get the first board', function () {
    var params = {
      periodId: 101,
      userFilterId: 13,
      activityFilterId: 301
    };
    return leaderboards.getBoards(params)
      .then(function(boards) {
        expect(boards).to.be.defined;
      });
  });
});