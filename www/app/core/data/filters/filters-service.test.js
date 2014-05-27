/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('filters service', function() {
  var mockData = {};
  var filters;

  // Load the module
  beforeEach(module('sproutApp.data.filters'));

  // Provide mocks
  beforeEach(module(function($provide) {
    $provide.factory('$q', function() {
      return Q;
    });
  }));

  // Reset mock data;
  beforeEach(function() {
    mockData = {};
    filters = testUtils.getService('filters');
  });

  it('filters service should get loaded', function () {
    expect(filters).to.not.be.undefined;
  });

  it('should define all the requried filterTypes', function(){
    expect(filters).to.have.property('streamItemFilters');
    expect(filters).to.have.property('userFilters');
    expect(filters).to.have.property('activityFilters');
    expect(filters).to.have.property('timePeriodFilters');
  });
});