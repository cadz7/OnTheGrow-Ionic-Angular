/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('networkInformation service', function() {
  var mockData = {};
  var networkInformation;

  // Load the module
  beforeEach(module('sproutApp.network-information'));

  // Provide mocks
  beforeEach(module(function($provide) {
    $provide.factory('$q', function() {
      return Q;
    });
  }));

  // Reset mock data;
  beforeEach(function() {
    mockData = {};
    networkInformation = testUtils.getService('networkInformation');
  });

  function testTransition(initialValue, newValue, listenTo) {
    var listener1 = sinon.spy();
    var listener2 = sinon.spy();
    networkInformation.simulate.setStatus(initialValue);
    expect(networkInformation.isOnline).to.equal(initialValue);
    networkInformation[listenTo](listener1);
    networkInformation[listenTo](listener2);
    networkInformation.simulate.setStatus(newValue);
    expect(networkInformation.isOnline).to.equal(newValue);
    listener1.should.have.been.calledOnce;
    listener2.should.have.been.calledOnce;
  };

  it('should change status and fire listeners', function () {
    testTransition(true, false, 'onOffline');
    testTransition(false, true, 'onOnline');
  });
});