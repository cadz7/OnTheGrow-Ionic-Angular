/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('leaderboards service', function() {
  var mockData = {};

  // Load the module
  beforeEach(module('sproutApp.data.leaderboards'));

  // Provide mocks
  beforeEach(module(function($provide) {
    $provide.factory('$q', function() {
      return Q;
    });
  }));

  // Reset mock data;
  beforeEach(function() {
    mockData = {};
  });

  it('leaderboards service should get loaded', function () {
    var leaderboards = testUtils.getService('leaderboards');
    expect(leaderboards).to.not.be.undefined;
  });

  it('should get the first board', function () {
    var leaderboards = testUtils.getService('leaderboards');
    var params = {
      periodId: 1,
      activityFilterId: 1,
      userFilterId: 1
    };
    return leaderboards.getBoard(params)
      .then(function(board) {
        expect(board.leaderboardNameDisplay).to.equal('Company');
        expect(board.items[1].entityId).to.equal(1002);
      });
  });

  it('should get the second board', function () {
    var leaderboards = testUtils.getService('leaderboards');
    var params = {
      periodId: 2,
      activityFilterId: null,
      userFilterId: 1
    };
    return leaderboards.getBoard(params)
      .then(function(board) {
        expect(board.leaderboardNameDisplay).to.equal('Foo');
        expect(board.items[1].entityId).to.equal(2002);
      });
  });

});