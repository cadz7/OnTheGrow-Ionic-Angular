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
  beforeEach(module('sproutApp.services.sync'));

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
    service = testUtils.getService('sync');
    server = testUtils.getService('server');
  });

  it('should get loaded', function () {
    expect(service).to.not.be.undefined;
  });

//  it('queue should add a request to the queue...', function() {
//    sync.queue('request', 'arg');
//
//    server.post.should.have.been.calledOnce;
//  });
});