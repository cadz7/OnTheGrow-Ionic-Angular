/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('activities service', function() {
  var mockData = {}
  , activities, apiRoots={};

  // Load the module
  beforeEach(module('sproutApp.data.activities'));

  // Provide mocks
  beforeEach(module(function($provide) {
    $provide.factory('$q', function() {
      return Q;
    });
    $provide.factory('user', function() {
      return mockData.user;
    });
    $provide.factory('server', function(){
      return {
        get : function(url, query){
          var deferred = Q.defer();

          switch(url){
            case apiRoots.activityCategoryEndpoint:
              deferred.resolve([{some:'thing'}]);              
            break;
            case apiRoots.activityLogEndpoint:
              deferred.resolve([{some:'thing'}]);
            break;
            
            default:
              deferred.reject('unknown url: '+url);
            break;
          }

          return deferred.promise;

        },
        post : function(url, data){
          var deferred = Q.defer();
           switch(url){
            case apiRoots.activityLogEndpoint:
              deferred.resolve([{result:true}]);
            break;
            
            default:
              deferred.reject('unknown url: '+url);
            break;
          }
          return deferred.promise;
        }
      };
    });//SERVER
  }));

  // Reset mock data;
  beforeEach(function() {
    mockData = {};
    mockData.user = {
      isAuthenticated: true
    };
    activities = testUtils.getService('activities');
  });

  beforeEach(inject(function($injector) {
    apiRoots = $injector.get('API_CONSTANTS'); 
  }));

  it('activities service should get loaded', function () {
    expect(activities).to.not.be.undefined;
  });

  it('activities service should get the right data', function (done) {
    return activities.whenReady()
      .then(function() {
        expect(activities.categories).to.be.defined;
        expect(activities.categories.length).to.be.above(0);
        done();
      },done);
  });  

  it('should load a activity log',function(done){
    return activities.whenReady()
      .then(function() {
        return activities.loadActivityLog(1,1);
      })
      .then(function(result){
        expect(result).to.be.an.array;
        done();
      })
      .then(null,done);
  });

  it('should post a new log', function (done) {
    var loggedActivities = [
      {
        activityUnitId : 101, 
        quantity: 40
      }, {
        activityUnitId : 102,
        quantity: 60
      }
    ];
    return activities.logActivities(loggedActivities)
      .then(function(returnedLog) {
        expect(returnedLog).to.be.an.array;
        done();
      },done);
  });    
});