/* globals describe, it, beforeEach, module, chai, expect console, Q,
   testUtils, _ */
/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('streamItems service', function() {
  var mockData = {};

  // Load the module
  beforeEach(module('sproutApp.data.stream-items'));

  // Provide mocks
  beforeEach(module(function($provide) {
    $provide.factory('$q', function() {
      return Q;
    });

    $provide.factory('user', function () {
      return {
        data: {},
        login: function() {
          var deferred = Q.defer();
          this.isAuthenticated = true;
          this.data = {
            userId: 42,
            firstName: 'Arthur',
            lastName: 'Dent'
          };
          deferred.resolve();
          return deferred.promise;
        }
      };
    });
  }));

  // Reset mock data;
  beforeEach(function() {
    mockData = {};
  });

  it('streamItems service should get loaded', function () {
    var streamItems = testUtils.getService('streamItems');
    expect(streamItems).to.not.be.undefined;
  });

  function reload() {
    var streamItems = testUtils.getService('streamItems');
    expect(streamItems.items.length).to.equal(0);
    return streamItems.reload()
      .then(function(items) {
        expect(items.length).to.equal(10);
        expect(streamItems.items.length).to.equal(10);
        return items;
      });
  }

  function getIds(items) {
    return _.map(items, function(item) {
      return item.streamItemId;
    });
  }

  function verifyOrderOfIds(items) {
    var ids = getIds(items);

    var sortedIds = _.sortBy(ids, function(id) {
      return -id; // reverse
    });

    expect(sortedIds).to.deep.equal(ids);
  }

  it('should load the first batch of items', function () {
    return reload();
  });

  it('should get earlier items', function () {
    var streamItems = testUtils.getService('streamItems');
    return reload()
      .then(function(items) {
        return streamItems.getEarlier();
      })
      .then(function(items) {
        verifyOrderOfIds(streamItems.items);
        expect(items.length).to.equal(10);
        expect(streamItems.items.length).to.equal(20);
        return streamItems.getEarlier();
      })
      .then(function(items) {
        verifyOrderOfIds(streamItems.items);
        expect(items.length).to.equal(10);
        expect(streamItems.items.length).to.equal(30);
      });
  });

  function verifyUpdate(items, prevCount, increment) {
    var streamItems = testUtils.getService('streamItems');
    expect(items.length).to.equal(increment);
    expect(streamItems.items.length).to.equal(prevCount);
    verifyOrderOfIds(streamItems.items);
    streamItems.applyUpdate();
    expect(streamItems.items.length).to.equal(prevCount + increment);
    verifyOrderOfIds(streamItems.items);
    streamItems.applyUpdate();
    expect(streamItems.items.length).to.equal(prevCount + increment);
    verifyOrderOfIds(streamItems.items);
  }

  it('should get an update', function () {
    var streamItems = testUtils.getService('streamItems');
    return reload()
      .then(function(items) {
        return streamItems.getUpdate();
      })
      .then(function(items) {
        verifyUpdate(items, 10, 3);
        return streamItems.getUpdate();
      })
      .then(function(items) {
        verifyUpdate(items, 13, 3);
        // streamItems.items.forEach(function(item) {
        //   console.log(JSON.stringify(item, null, 2));
        // });
      });
  });

  it('should fail to delete without authentication', function () {
    var streamItems = testUtils.getService('streamItems');
    return reload()
      .then(function(items) {
        return streamItems.deletePost(items[5]);
      })
      .then(function() {
        throw new Error ('Should have been rejected');
      }, function(error) {
        expect(error).to.be.truthy;
        expect(streamItems.items.length).to.equal(10);
      });
  });

  function authenticateAndDelete(postIndex) {
    var streamItems = testUtils.getService('streamItems');
    var user = testUtils.getService('user');
    return user.login('arthur')
      .then(function() {
        return reload();
      })
      .then(function(items) {
        return streamItems.deletePost(items[postIndex]);
      })
  };

  it('should delete users own post', function () {
    var streamItems = testUtils.getService('streamItems');
    return authenticateAndDelete(5)
      .then(function() {
        expect(streamItems.items.length).to.equal(9);
      });
  });

  it('should fail to delete someone elses post', function () {
    var streamItems = testUtils.getService('streamItems');
    return authenticateAndDelete(6)
      .then(function() {
        throw new Error ('Should have been rejected');
      }, function(error) {
        expect(error).to.be.truthy;
      });
  });

});