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
        var comments = streamItems.items[1].comments;
        expect(items.length).to.equal(10);
        expect(streamItems.items.length).to.equal(10);
        expect(comments.length).to.equal(3);
        expect(comments[0].commentText).to.be.a.string;
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

  it('should load more comments', function () {
    var streamItems = testUtils.getService('streamItems');
    var item;

    return reload()
      .then(function(items) {
        item = items[0];
        return item.getMoreComments();
      })
      .then(function(comments) {
        expect(comments.length).to.equal(3);
        expect(item.comments.length).to.equal(6);
        return item.getMoreComments();
      })
      .then(function(comments) {
        expect(comments.length).to.equal(3);
        expect(item.comments.length).to.equal(9);
        return item.getMoreComments();
      })
      .then(function(comments) {
        expect(comments).to.be.falsy;
        expect(item.comments.length).to.equal(9);
      });
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

  function authenticate() {
    var streamItems = testUtils.getService('streamItems');
    var user = testUtils.getService('user');
    return user.login('arthur')
      .then(function() {
        return reload();
      });
  }

  function authenticateAndDelete(postIndex) {
    var streamItems = testUtils.getService('streamItems');
    return authenticate()
      .then(function(items) {
        return streamItems.deletePost(items[postIndex]);
      });
  }

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

  it('should post a new comment', function () {
    var streamItems = testUtils.getService('streamItems');
    var item;
    var commentText1 = 'Time is an illusion. Lunchtime doubly so.';
    var commentText2 = 'Don\'t Panic!';
    var comment1;
    var comment2;
    return authenticate()
      .then(function(items) {
        item = items[0];
        return item.postComment(commentText1);
      })
      .then(function(comment) {
        comment1 = comment;
        expect(comment.commentText).to.equal(commentText1);
        expect(item.comments[item.comments.length-1]).to.equal(comment1);
        return item.postComment(commentText2);
      })
      .then(function(comment) {
        comment2 = comment;
        expect(comment.commentText).to.equal(commentText2);
        expect(item.comments[item.comments.length-1]).to.equal(comment2);
        expect(item.comments[item.comments.length-2]).to.equal(comment1);
      });
  });

});