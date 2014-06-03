/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('membership service', function () {
  var mockData = {};
  var membership;

  // Load the module
  beforeEach(module('sproutApp.data.membership'));

  // Provide mocks
  beforeEach(module(function ($provide) {
    $provide.factory('$q', function () {
      return Q;
    });
    $provide.factory('Notify', function() { return {warn:function() {}}});
  }));

  // Reset mock data;
  beforeEach(function () {
    mockData = {};
    membership = testUtils.getService('membership');
  });

  it('membership service should get loaded', function () {
    var membership = testUtils.getService('membership');
    expect(membership).to.not.be.undefined;
  });

  // TODO not actually working
  it('should join a challenge successfully', function () {
    membership.joinChallenge(1, 2)
      .then(function (res) {
      });
  });

  it('should join a challenge unsuccessfully', function () {
    membership.joinChallenge(1, 2)
      .then(function (res) {
        expect(res).to.equal('errord');
      });
  });
//
//  it('should get the first board', function () {
//    var params = {
//      periodId: 101,
//      userFilterId: 201,
//      activityFilterId: 301
//    };
//    return membership.getBoard(params)
//      .then(function (board) {
//        expect(board.leaderboardNameDisplay).to.equal('Company');
//        expect(board.items[1].entityId).to.equal(1002);
//      });
//  });
//
//  it('should get the second board', function () {
//    var params = {
//      periodId: 2,
//      activityFilterId: null,
//      userFilterId: 1
//    };
//    return membership.getBoard(params)
//      .then(function (board) {
//        expect(board.leaderboardNameDisplay).to.equal('Foo');
//        expect(board.items[1].entityId).to.equal(2002);
//      });
//  });

});