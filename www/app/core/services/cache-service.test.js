/**
 * Created by justin on 2014-05-20.
 */


/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('cache service', function() {
  var mockData = {};
  var cache;

  // Load the module
  beforeEach(module('sproutApp.services.cache'));

  // Provide mocks
  beforeEach(module(function ($provide) {
    $provide.factory('$q', function () {
      return Q;
    });
    $provide.factory('user', function () {
      return mockData.user;
    });
  }));

  // Reset mock data;
  beforeEach(function () {
    mockData = {};
    mockData.user = {
      isAuthenticated: true
    };
    cache = testUtils.getService('cache');
  });

  it('cache service should get loaded', function () {
    expect(cache).to.not.be.undefined;
  });
});
