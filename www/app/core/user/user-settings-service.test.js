/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('user settings service', function() {
  var mockData = {};
  var userSettings;

  // Load the module
  beforeEach(module('sproutApp.user-settings'));

  // Provide mocks
  beforeEach(module(function($provide) {
    $provide.factory('$q', function() {
      return Q;
    });
  }));

  // Reset mock data;
  beforeEach(function() {
    mockData = {};
    userSettings = testUtils.getService('userSettings');
  });

  it('userSettings service should get loaded', function () {
    expect(userSettings).to.not.be.undefined;
  });

  it('userSettings service should initialize', function () {
    var userSettings1 = {
        autoPostActivities: false,
        remindNotifications: false,
        rememberMe: true
      };
    
    userSettings.fetchSettings().then(function(fetchedSettings) {
      expect(fetchedSettings).to.equal(userSettings1);
    });
  });

  it('userSettings service should set an existing value', function (done) {
    var userSettings1 = {
        autoPostActivities: false,
        remindNotifications: false,
        rememberMe: true
      };
    
    userSettings.fetchSettings().then(function(fetchedSettings) {
      expect(fetchedSettings).to.equal(userSettings1);
    });

    userSettings.saveSetting('rememberMe', false).then(function() {
      userSettings.fetchSettings().then(function(fetchedSettings) {
        expect(fetchedSettings.rememberMe).to.equal(false);
        done();
      });
    }, function(error) {
      done(new Error("calling saveSetting should have saved a setting"));
    });
  });

  it('saveSetting service should not save an invalid setting', function (done) {
    var userSettings1 = {
        autoPostActivities: false,
        remindNotifications: false,
        rememberMe: true
      };
    
    userSettings.fetchSettings().then(function(fetchedSettings) {
      expect(fetchedSettings).to.equal(userSettings1);
    });

    userSettings.saveSetting('rememberMeNot', false).then(function() {
      userSettings.fetchSettings().then(function(fetchedSettings) {
        expect(fetchedSettings.rememberMe).to.equal(false);
        done(new Error("calling saveSetting should not have saved an invalid setting"));
      });
    }, function(error) {
      expect(error).to.equal("Unable to save setting: 'rememberMeNot' key was not found")
      done();
    });
  });
});