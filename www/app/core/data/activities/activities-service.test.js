/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('activities service', function() {
  var mockData = {};

  // Load the module
  beforeEach(module('sproutApp.data.activities'));

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

  it('activities service should get loaded', function () {
    var activities = testUtils.getService('activities');
    expect(activities).to.not.be.undefined;
  });

  it('activities service should get the right data', function () {
    var activities = testUtils.getService('activities');
    return activities.whenReady()
      .then(function() {
        var cardio = activities.categories[0];
        var cycling = cardio.activities[2];
        expect(activities.categories.length).to.equal(6);
        expect(cardio.activityCategoryId).to.equal(13);
        expect(cardio.activityCategoryDisplayName).to.equal('Cardio');
        expect(cardio.activities.length).to.equal(36);
        expect(cycling.activityName).to.equal('Cycling');
        expect(cycling.unitName).to.equal('km');
      });
  });

});