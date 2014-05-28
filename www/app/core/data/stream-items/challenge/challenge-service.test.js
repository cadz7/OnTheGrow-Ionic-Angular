/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('challenge service', function () {
  var mockData = {};
  var challenge;

  // Load the module
  beforeEach(module('sproutApp.data.challenge'));

  // Provide mocks
  beforeEach(module(function ($provide) {
    $provide.factory('$q', function () {
      return Q;
    });
  }));

  // Reset mock data;
  beforeEach(function () {
    mockData = {};
    challenge = testUtils.getService('challenge');
  });

  it('challenge service should get loaded', function () {
    var challenge = testUtils.getService('challenge');
    expect(challenge).to.not.be.undefined;
  });

});