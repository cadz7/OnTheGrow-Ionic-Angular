/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('activities service', function() {
  var mockData = {};
  var activities;

  // Load the module
  beforeEach(module('sproutApp.data.activities'));

  // Provide mocks
  beforeEach(module(function($provide) {
    $provide.factory('$q', function() {
      return Q;
    });
    $provide.factory('user', function() {
      return mockData.user;
    });
  }));

  // Reset mock data;
  beforeEach(function() {
    mockData = {};
    mockData.user = {
      isAuthenticated: true
    };
    activities = testUtils.getService('activities');
  });

  it('activities service should get loaded', function () {
    expect(activities).to.not.be.undefined;
  });

  it('activities service should get the right data', function () {
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

  it('activities service should get the right data', function () {
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

  it('should post a new log', function () {
    var loggedActivities = [
      {
        activityUnitId : 101, 
        quantity: 40
      }, {
        activityUnitId : 102,
        quantity: 60
      }
    ];
    return activities.logActivities(loggedActivities)
      .then(function(returnedLog) {
        expect(returnedLog).to.be.an.array;
        expect(returnedLog[0]).to.have.property('streamItemId');
      });
  });

  it('should reject a post with the wrong activity ID', function () {
    var loggedActivities = [
      {
        activityUnitId : 1043232, 
        quantity: 40
      }
    ];
    return activities.logActivities(loggedActivities)
      .then(function(returnedLog) {
        throw new Error('Should have rejected');
      }, function(error) {});
  });

  it('should reject a post without a quantity', function () {
    var loggedActivities = [
      {
        activityUnitId : 101
      }
    ];
    return activities.logActivities(loggedActivities)
      .then(function(returnedLog) {
        throw new Error('Should have rejected');
      }, function(error) {});
  });
});