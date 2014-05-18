/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('streamItems service', function () {

  // Load the module
  beforeEach(module('sproutApp.util'));

  beforeEach(module(function ($provide) {
    $provide.factory('$q', function () {
      return Q;
    });
  }));

  it('util service should get loaded', function () {
    var util = testUtils.getService('util');
    expect(util).to.not.be.undefined;
  });

  it('makeResolvedPromise should return a resolved promise', function () {
    var util = testUtils.getService('util');
    return util.q.makeResolvedPromise(42)
      .then(function (value) {
        expect(value).to.equal(42);
      });
  });

  it('makeRejectedPromise should return a rejected promise', function () {
    var util = testUtils.getService('util');
    return util.q.makeRejectedPromise(42)
      .then(function (value) {
        throw new Error('Should have rejected');
      }, function (error) {
        expect(error).to.equal(42);
      });
  });
});