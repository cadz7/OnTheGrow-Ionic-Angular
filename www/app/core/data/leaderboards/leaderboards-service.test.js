/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('leaderboards service', function() {
  var mockData = {};
  var leaderboards;

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
    leaderboards = testUtils.getService('leaderboards');
  });

  it('leaderboards service should get loaded', function () {
    var leaderboards = testUtils.getService('leaderboards');
    expect(leaderboards).to.not.be.undefined;
  });

  it('should get periods', function() {
    leaderboards.loadPeriods()
      .then(function() {
        var period = leaderboards.periods[1];
        expect(period.timePeriodNameDisplay).to.equal('This week');
      });
  });

  it('should get the first board', function () {
    var params = {
      periodId: 101,
      userFilterId: 13,
      activityFilterId: 301
    };
    return leaderboards.getBoards(params)
      .then(function(boards) {
        expect(boards[0].leaderboardNameDisplay).to.equal('Top 5 in Pronvice');
        expect(boards[0].items[1].entityId).to.equal(105);
      });
  });

  it('should get the second board', function () {
    var params = {
      periodId: 2,
      activityFilterId: null,
      userFilterId: 1
    };
    return leaderboards.getBoards(params)
      .then(function(boards) {
        expect(boards[0].leaderboardNameDisplay).to.equal('Top 5 in Company');
        expect(boards[0].items[1].entityId).to.equal(101);
      });
  });

});