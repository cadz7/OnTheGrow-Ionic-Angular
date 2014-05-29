/* jshint expr:true */

'use strict';
var expect = chai.expect;
describe('streamItems service', function() {
  var mockData = {};
  var streamItems,apiRoots,APP_CONFIG;
  // Load the module
  beforeEach(module('sproutApp.data.stream-items'));



  // Provide mocks
  beforeEach(module(function($provide) {

    $provide.factory('Notify', function() {
    return {
      userError: function() {},
      apiError: function() {},
      userSuccess: function() {},
      notifyTheCommonErrors: function() {}
    }});

    $provide.factory('server',function(){
      return {
        get : function(url,params){
          var deferred = Q.defer();

          switch(url){
            case apiRoots.streamItemsEndPoint :
              deferred.resolve([
                {
                  streamItemId: 1,
                  streamItemTypeSlug: 'add_notification',
                  owner: {
                    userId : 42
                  },
                  viewer: {
                    isLikedByViewer: 1,
                    isOwnedByViewer: 0,
                    isPrivacyOn: 0,
                    isMember: 0,
                    eligibleGroups: [{
                      id: 1324,
                      name: 'group 1'
                    }, {
                      id: 2314,
                      name: 'group 2'
                    }]
                  },
                  relatedToId: 3142,
                  relationTypeSlug: 'activity',
                  dateTimeCreated: '2014-05-14T15:22:11Z',
                  streamItemDisplay: {
                    template: '{user.name} just tracked: {qty} {units} of {activity}', // quick change to make it accessible for next leg
                    values: {
                      activity: 'cycling',
                      qty: '5',
                      units: 'km',
                      points: '48',
                      user: {
                        'id': '1971',
                        'name': 'Will Melbourne'
                      },
                      mainInfo: 'Main info',
                      subInfo: 'Sub Info',
                      title: 'Some Title',
                      userCaption: 'did something'
                    }
                  },
                  canBePrivate: 1,
                  likeCount: 10,
                  avatarURL: 'https://optime.sproutatwork.com/uploads/user/2234_1_s.jpg',
                  comments: []
                },
                {owner: {userId : 100000},comments:[{id:1},{id:2},{id:3}]},
                {comments:[{id:1},{id:2},{id:3}]},
                {comments:[{id:1},{id:2},{id:3}]},
                {comments:[{id:1},{id:2},{id:3}]},
                {comments:[{id:1},{id:2},{id:3}]},
                {comments:[{id:1},{id:2},{id:3}]},
                {comments:[{id:1},{id:2},{id:3}]},
                {comments:[{id:1},{id:2},{id:3}]},
                {comments:[{id:1},{id:2},{id:3}]}
              ]);
            break;
            case apiRoots.comments:
              deferred.resolve([
                {id:1},
                {id:2},
                {id:3},
                {id:4}                                                
                ])
            break;
            default:
              deferred.reject(new Error('unexpected url: '+url))
            break;
          }
          return deferred.promise;
        },
        post : function(url,data){
          var deferred = Q.defer();
          data.id = 99999;
          switch(url){
            case apiRoots.streamItemsEndPoint :
              deferred.resolve(data);
              break;
            default: deferred.reject(new Error('unexpected url: '+url));
          }
          return deferred.promise;
        },
        delete : function(url){
          var deferred = Q.defer();
          if(url.indexOf(apiRoots.streamItemsEndPoint) >= 0 )
            deferred.resolve();
          else 
            deferred.reject(new Error('unexpected url: '+url));
          
          return deferred.promise;
        }
        
      };
    });

    $provide.factory('$q', function() {
      return Q;
    });

    $provide.factory('$interval', function() {
      return setInterval;
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
    streamItems = testUtils.getService('streamItems');
  });

  beforeEach(inject(function($injector) {
    apiRoots = $injector.get('API_CONSTANTS'); 
    APP_CONFIG =  $injector.get('APP_CONFIG'); 
  }));

  it('streamItems service should get loaded', function () {
    expect(streamItems).to.not.be.undefined;
  });

  function reload() {
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

  it('should load the first batch of items with liking and commenting functions attached', function () {
    return reload()
    .then(function(items){
      expect(items).to.not.be.undefined;
      expect(items.length).to.be.above(0);
      expect(items[0]).itself.to.respondTo('getMoreComments');
      expect(items[0]).itself.to.respondTo('postComment');
      expect(items[0]).itself.to.respondTo('likePost');
      expect(items[0]).itself.to.respondTo('unlikePost');
    });
  });

  it('should load more comments', function () {
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
    var user = testUtils.getService('user');
    return user.login('arthur')
        .then(function() {
          return reload();
        });

  }

  function authenticateAndDelete(postIndex) {
    return authenticate()
        .then(function(items) {
          return streamItems.deletePost(items[postIndex]);
        });
  }


  it('should delete users own post', function (done) {
    return authenticateAndDelete(4)
      .then(function() {
        expect(streamItems.items.length).to.equal(9);
        done();
      },done);
  });

  it('should fail to delete someone elses post', function () {
    return authenticateAndDelete(1)
      .then(function() {
        throw new Error ('Should have been rejected');
      }, function(error) {
        expect(error).to.be.truthy;
      });
  });

  it('should post a new comment', function () {
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

  it('should post a new item', function() {
    return authenticate()
        .then(function() {
          return streamItems.postItem({text: 'Mostly harmless.'})
        })
        .then(function(newItem) {
          expect(newItem.owner.firstName).to.equal('Arthur');
          expect(streamItems.items.length).to.equal(11);
          expect(streamItems.items[0]).to.equal(newItem);
        });

  });

  it('should like and unlike a post', function () {
    return reload().then(function(items) {

      // likes are populated by id % 2, starting id is 1
      // likeCount is always set to 10
      // post liking is synchronous (currently)

      var item = items[0];
      expect(item.viewer.isLikedByViewer).to.equal(1);
      expect(item.likeCount).to.equal(10);
      item.likePost().then(
          function() {
            throw new Error('unauthenticated users should not be allowed to like/unlike');
          },
          function(error) {
            expect(error).to.equal('Not athenticated.');

            // starting out with a previously-Liked post (this ordinarily wouldn't happen since the viewer is not logged in)
            expect(item.viewer.isLikedByViewer).to.equal(1);
            expect(item.likeCount).to.equal(10);

            authenticate()
                .then(function(items) {
                  var item = items[0];

                  // should still be the same
                  expect(item.viewer.isLikedByViewer).to.equal(1);
                  expect(item.likeCount).to.equal(10);

                  // unlike a liked post
                  item.unlikePost().then( function() {
                    expect(item.viewer.isLikedByViewer).to.equal(0);
                    expect(item.likeCount).to.equal(9);

                    // unlike a post that is not currently liked
                    item.unlikePost().then( function() {
                      expect(item.viewer.isLikedByViewer).to.equal(0);
                      expect(item.likeCount).to.equal(9);

                      // like a previously unliked post
                      item.likePost().then( function() {
                        expect(item.viewer.isLikedByViewer).to.equal(1);
                        expect(item.likeCount).to.equal(10);
                      });
                    });
                  });
                }).then(null, function(error) {
                  throw new Error(error);
                });
          }
      );
    });
  });

  it('should get autoupdates', function(done) {
    var listener1 = sinon.spy();
    var listener2 = sinon.spy();
    return reload()
        .then(function() {
          try {
            streamItems.onUpdate(listener1);
            streamItems.onUpdate(listener2);
            streamItems.turnOnAutoUpdate(10);
          } catch (e) {
            done(e);
          }
          setTimeout(function() {
            try {
              listener1.should.have.been.called;
              listener2.should.have.been.called;
              done();
            } catch (e) {
              done(e);
            }
          }, 50);
        })
  });

});