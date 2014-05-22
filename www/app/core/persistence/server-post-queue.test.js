/**
 * Created by justin on 2014-05-20.
 */


/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('sync service', function() {
  var mockData = {}
      ,service
      ,server;

  // Load the module
  beforeEach(module('sproutApp.server-post-queue'));

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
    service = testUtils.getService('server-post-queue');
    server = testUtils.getService('server');
  });

  it('should get loaded', function () {
    expect(service).to.not.be.undefined;
  });

  it('queue should add a request to the queue...', function() {
    var postMethod = sinon.spy(server, 'post');

    service.queue('request', 'arg');
    server.connected();

    postMethod.should.have.been.calledWith('request', 'arg');
  });
});