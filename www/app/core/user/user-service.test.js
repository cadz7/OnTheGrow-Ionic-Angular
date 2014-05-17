/* globals describe, it, chai, console */

'use strict';
var expect = chai.expect;
describe('user service', function() {
  var mockData = {};

  // Load the module
  beforeEach(module('sproutApp.user'));

  // Provide mocks
  beforeEach(module(function($provide) {
    $provide.factory('$q', function() {
      return Q;
    });
    $provide.factory('userStorage', function () {
      return {
        get: sinon.spy(function(key) {
          return mockData.user;
        }),
        set: sinon.spy(function(key, value) {
          mockData.user = value;
        })
      };
    });
  }));

  // Reset mock data;
  beforeEach(function() {
    mockData = {};
  });

  it('user service should get loaded', function () {
    var userStorage = testUtils.getService('userStorage');
    var user = testUtils.getService('user');
    expect(user).to.not.be.undefined;
    userStorage.get.should.have.been.calledOnce;
  });

  it('user should be initially unauthenticated', function () {
    var userStorage = testUtils.getService('userStorage');
    var user = testUtils.getService('user');
    expect(user.data).to.be.falsy;
    expect(user.isAuthenticated).to.be.false;
    userStorage.get.should.have.been.calledOnce;
  });

  it('user data should come from userStorage', function () {
    mockData.user = {
      userId: 123,
      firstName: 'Ford',
      lastName: 'Prefect'
    };
    var userStorage = testUtils.getService('userStorage');
    var user = testUtils.getService('user');
    expect(user.data).to.not.be.falsy;
    expect(user.data.userId).to.equal(123);
    expect(user.isAuthenticated).to.be.true;
    userStorage.get.should.have.been.calledOnce;
  });

  function testLogin(username, password) {
    var userStorage = testUtils.getService('userStorage');
    var user = testUtils.getService('user');

    expect(user.data).to.be.falsy;
    expect(user.isAuthenticated).to.be.false;
    userStorage.get.should.have.been.calledOnce;
    return user.login(username, password);
  }

  it('should authenticate user', function () {
    var user = testUtils.getService('user');
    var promise = user.whenAuthenticated();
    expect(user.isAuthenticated).to.be.falsy;
    expect(promise.isPending()).to.be.truthy;
    return testLogin('arthur')
      .then(function() {
        expect(user.isAuthenticated).to.be.truthy;        
        expect(user.data.userId).to.equal(42);
        expect(promise.isPending()).to.be.falsy;
      });
  });

  it('should not authenticate wrong username', function () {
    var user = testUtils.getService('user');
    return testLogin('bob')
      .then(function() {
        throw new Error('The promise should have been rejected');
      }, function(error) {
        expect(error.errorCode).to.equal('wrong-password');
      });
  });
});