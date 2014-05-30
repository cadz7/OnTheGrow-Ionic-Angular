/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('filters service', function() {
  var mockData = {};
  var filters, apiRoots;

  beforeEach(module('sproutApp.data.filters'));

  beforeEach(module(function($provide) {
    $provide.factory('$q', function() {
      return Q;
    });

    $provide.factory('user', function() {
      return {
        whenAuthenticated : function(){
          var deferred = Q.defer();
          deferred.resolve();
          return deferred.promise;
        }
      } 
    });
  }));

  beforeEach(function(){
    mockData = {};
    mockData.user = {
      isAuthenticated: true
    };

    filters = testUtils.getService('filters');
  });

  beforeEach(inject(function($injector) {
    apiRoots = $injector.get('API_CONSTANTS'); 
  }));

  it('filters service should get loaded', function () {
    expect(filters).to.not.be.undefined;
  });

  it('should define all the requried filterTypes', function(){
    expect(filters).to.have.property('streamItemFilters');
    expect(filters).to.have.property('userFilters');
    expect(filters).to.have.property('activityFilters');
    expect(filters).to.have.property('timePeriodFilters');
    expect(filters).to.have.property('shareWithFilters');
    expect(filters).to.have.property('defaultTimePeriod');


  });

  it('should handle all of the filterTypes expected from the server', function(done){
    return filters.whenReady().then(function(){
      expect(filters.streamItemFilters.length).to.be.above(0);
      expect(filters.userFilters.length).to.be.above(0);
      expect(filters.activityFilters.length).to.be.above(0);
      expect(filters.timePeriodFilters.length).to.be.above(0);
      expect(filters.shareWithFilters.length).to.be.above(0);
      expect(filters.defaultTimePeriod).to.be.defined;
      done();
    })
    .then(null,done);
  });
});