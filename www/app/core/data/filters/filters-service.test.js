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
    expect(filters.userFilters[0].displayName).to.equal('Cool people');
  });

});