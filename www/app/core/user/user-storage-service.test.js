/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('user storage service', function() {
  var mockData = {};
  var userStorage;

  // Load the module
  beforeEach(module('sproutApp.user.storage'));

  // Provide mocks
  beforeEach(module(function($provide) {
    $provide.factory('$q', function() {
      return Q;
    });
  }));

  // Reset mock data;
  beforeEach(function() {
    mockData = {};
    userStorage = testUtils.getService('userStorage');
  });

  it('userStorage service should get loaded', function () {
    expect(userStorage).to.not.be.undefined;
  });

  it('userStorage service set and get a value', function () {
    var user1 = {
      foo: 'bar'
    };
    var user2;
    userStorage.set(user1);
    user2 = userStorage.get();
    expect(user2.foo).to.equal('bar');
  });

});