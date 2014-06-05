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
  beforeEach(module('sproutApp.cache'));

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
    cache.deleteAll();
  });

  it('should get loaded', function () {
    expect(cache).to.not.be.undefined;
  });

  it('push(key, val) should push the value onto array referenced by "key"', function() {
    cache.push('items', 'hello');
    expect(cache.get('items')).to.include('hello');
    cache.push('items', 'worlds');
    expect(cache.get('items')).to.include('hello');
    expect(cache.get('items')).to.include('worlds');
  });

  it('should store 1mb of data successfully', function() {
    var Mb = 1048576;
    var length = Mb;

    cache.set('key', new Array(Mb +1).join('n'));
    var val = cache.get('key');
    expect(val.length).to.be.equal(length);
    expect(val[34738]).to.be.equal('n');
  });
});
