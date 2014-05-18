// Load Chai's expect library for assertions.
var expect = chai.expect;

beforeEach(function(){
  module('sproutApp.controllers');
});
beforeEach(function(){
  module('sproutApp.services');
});

xdescribe('leaders', function () {
  var ctrl, scope, service;

  beforeEach(inject(function($rootScope, $controller, headerRemote) {
    scope = $rootScope.$new();
    service = headerRemote;
    ctrl = $controller('LeaderboardsCtrl', {
      $scope: scope,
      headerRemote: service
    });
  }));

  it('should have an id', function () {
    expect(scope.leaderboardData[0]).to.have.property('user_id');
    expect(scope.leaderboardData[0].user_id).to.be.a('integer');
  });
});