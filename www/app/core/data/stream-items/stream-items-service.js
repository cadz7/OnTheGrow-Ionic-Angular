angular.module('sproutApp.data.stream-items', [
  'sproutApp.user',
  'sproutApp.util'
])

// This service exports a field .items containing an array of currently loaded
// items and three methods that affect the content of that array. See
// documentation below.

.factory('streamItems', ['$q', '$log', 'user', 'util', '$interval',
  function ($q, $log, user, util, $interval) {
    'use strict';
    var service = {
      items: [] // an array of currently loaded items
    };

    var latestId = 12345;
    var earliestId = 12345;
    var lastCommentId = 1000;
    var stagedUpdate; // Updated items we've got from the server and haven't
    // applied yet.
    var updateListeners = [];
    var autoUpdateInterval;

    var avatarURLs = [
      'img/user/arthur.png',
      'img/user/zaphod.png',
      'img/user/ford.png',
      'img/user/fenchurch.png',
      'img/user/humma.png'
    ];

    var comments = [
      'Go with a hunch of a man who\'s brain is fueled by lemons?',
      'Holy Zarquon!',
      'Life is like a grapefruit!',
      'Lorem ipsum.',
      'Oh mighty Arkleseizure!'
    ];

    var owners = [{
      userId: 42,
      firstName: 'Arthur',
      lastName: 'Dent',
    }, {
      userId: 43,
      firstName: 'Zaphod',
      lastName: 'Beeblebrox',
    }, {
      userId: 44,
      firstName: 'Ford',
      lastName: 'Prefect',
    }, {
      userId: 45,
      firstName: 'Fenchurch',
      lastName: 'Dent',
    }, {
      userId: 46,
      firstName: 'Humma',
      lastName: 'Kavula',
    }];

    // A template for mock data. This gets cloned and perhaps customized a bit
    // for each returned item.
    var mockStreamItemTemplate = {
      streamItemId: 1,
      streamItemTypeSlug: 'add_notification',
      owner: {},
      viewer: {
        isLikedByViewer: 0,
        isOwnedByViewer: 0,
        isPrivacyOn: 0,
        isMember: 0,
        eligibleGroups: [{
          id: 1324,
          name: 'group 1'
        }, {
          id: 2314,
          name: 'group 2'
        }],
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
          }
        }
      },
      canBePrivate: 1,
      likeCount: 10,
      avatarURL: 'https://optime.sproutatwork.com/uploads/user/2234_1_s.jpg',
      comments: []
    };

    function makeComment(item, author, commentText) {
      lastCommentId++;
      var authorIndex = lastCommentId % 5;
      commentText = commentText || comments[authorIndex];
      author = author || owners[authorIndex];
      var comment = {
        commentId: lastCommentId,
        commentedItemId: item.streamItemId,
        commentedItemTypeSlug: 'streamItem',
        avatarURL: avatarURLs[authorIndex],
        owner: _.cloneDeep(author),
        dateTimeCreated: new Date().toISOString(),
        commentText: commentText,
        commentDisplay: {
          template: '{user.firstName} says: {text}', // _ default tags
          values: {
            text: commentText,
            user: _.cloneDeep(author)
          }
        }
      };
      return comment;
    }
    // This is a stub: the streamItem from API will already have the correct type and template
    var streamItemTypeSlugs = [
      {itemType: 'add_notification', template: '{user.name} just tracked: {qty} {units} of {activity}'},
      {itemType: 'group', template: 'Group post by {user.name}', heroImg: 'img/group/group-default.png'},
      {itemType: 'event', template: 'Event post by {user.name}', heroImg: 'img/group/event-default.png'},
      {itemType: 'challenge', template: 'Challenge post by {user.name}', heroImg: 'img/group/event-default.png'}
    ];

    function makeStreamItem(id) {
      var item = _.cloneDeep(mockStreamItemTemplate);
      item.owner = _.cloneDeep(owners[id % 5]);
      item.avatarURL = avatarURLs[id % 5];
      item.viewer.isLikedByViewer = id % 2;
      item.viewer.isOwnedByViewer = item.owner.userId === 42 ? 1 : 0;
      item.streamItemId = id;
      item.streamItemDisplay.values.user.id = item.owner.userId;
      item.streamItemDisplay.values.user.name = item.owner.firstName + ' ' +
      item.owner.lastName;

      var streamItemTypeSlug = streamItemTypeSlugs[id % 4];
      item.streamItemTypeSlug = streamItemTypeSlug.itemType;
      item.streamItemDisplay.template = streamItemTypeSlug.template;
      item.streamItemDisplay.heroImg = streamItemTypeSlug.heroImg;

      for (var i = 0; i < 3; i++) {
        item.comments.push(makeComment(item));
      }
      item.getMoreComments = function () {
        var moreComments;
        if (item.comments.length < 9) {
          moreComments = [];
          for (var i = 0; i < 3; i++) {
            moreComments.push(makeComment(item));
            item.comments.push(makeComment(item));
          }
        }
        return util.q.makeResolvedPromise(moreComments);
      };
      item.postComment = function (commentText) {
        var newComment;
        if (!user.isAuthenticated) {
          return util.q.makeRejectedPromise('Not athenticated.');
        }
        newComment = makeComment(item, user.data, commentText);
        item.comments.push(newComment);
        return util.q.makeResolvedPromise(newComment);
      };
      item.likePost = function () {
        if (!user.isAuthenticated) {
          return util.q.makeRejectedPromise('Not athenticated.');
        }
        
        if (item.viewer.isLikedByViewer === 0) {
          item.viewer.isLikedByViewer = 1;
          item.likeCount++;
        }
        return util.q.makeResolvedPromise();
      };
      item.unlikePost = function () {
        if (!user.isAuthenticated) {
          return util.q.makeRejectedPromise('Not athenticated.');
        }
        
        if (item.viewer.isLikedByViewer === 1) {
          item.viewer.isLikedByViewer = 0;
          item.likeCount--;
        }
        return util.q.makeResolvedPromise();
      };

      return item;
    }

    function getStreamItemsInRange(lastId, firstId) {
      var deferred = $q.defer();
      var items = [];
      for (var i = lastId; i > firstId; i--) {
        items.push(makeStreamItem(i));
      }
      deferred.resolve(items);
      return deferred.promise;
    }

    function getStreamItems(params) {
      var maxCount = params.maxCount || 10;
      if (params.idLessThan) {
        return getStreamItemsInRange(params.idLessThan, params.idLessThan -
          maxCount);
      } else if (params.idGreaterThan) {
        return getStreamItemsInRange(params.idGreaterThan + maxCount, params.idGreaterThan);
      }
    }

    function pushItemsAtTheBottom(items) {
      Array.prototype.push.apply(service.items, items);
      earliestId = earliestId - items.length;
      if (earliestId < 0) {
        earliestId = 0;
      }
    }

    function pushItemsAtTheTop(items) {
      Array.prototype.unshift.apply(service.items, items);
      latestId = latestId + items.length;
    }

    /**
     * Replaces the current items with whatever are the latest matching items
     * on the server.
     *
     * @param  {Object} options        An object of options.
     * @return {promise}               A $q promise that resolves to the list
     *                                 of loaded items.
     */
    service.reload = function (options) {
      var params = {
        idLessThan: latestId
      };
      if (autoUpdateInterval) {
        $interval.cancel(autoUpdateInterval);
      }
      return getStreamItems(params)
        .then(function (items) {
          service.items.splice(0, service.items.length);
          pushItemsAtTheBottom(items);
          return items;
        });
    };

    /**
     * Loads the next batch of earlier items in the stream, adding them to the
     * current array. Use this for infinite scroll.
     *
     * @return {promise}               A $q promise that resolves to the list
     *                                 of added items.
     */
    service.getEarlier = function () {
      var params = {
        idLessThan: earliestId
      };
      return getStreamItems(params)
        .then(function (items) {
          pushItemsAtTheBottom(items);
          return items;
        });
    };

    function fireUpdateListeners(items) {
      updateListeners.forEach(function(listener) {
        listener(items);
      });
    };

    /**
     * Gets the most recent items - newer than what we've got. This function
     * does _not_ insert them into our current list of items, however. Instead,
     * it stashes them, so that the controller could decide whether to apply
     * this update or not.
     *
     * @return {promise}               A promise that resolves to the list
     *                                 of new items.
     */
    service.getUpdate = function () {
      var params = {
        idGreaterThan: latestId,
        maxCount: 3
      };

      return getStreamItems(params)
        .then(function (items) {
          stagedUpdate = items;
          fireUpdateListeners(items);
          return items;
        });
    };

    /**
     * Registers a function to listen to an update event.
     *
     * @param  {Function} listener     A function to be called when an update
     *                                 is available.
     * @return {undefined}             Nothing is returned.
     */
    service.onUpdate = function(listener) {
      updateListeners.push(listener);
    };

    // Fetch updates automatically on schedule.
    service.turnOnAutoUpdate = function(delay) {
      autoUpdateInterval = $interval(function() {
        service.getUpdate()
          .then(null, $log.error);
      }, delay);
      $log.info('Turned on autoupdate for streamItems.');
    };

    /**
     * Inserts staged update items at the top of the current list. This is a
     * _synchronous_ call.
     *
     * @return {undefined}             Nothing is returned.
     */
    service.applyUpdate = function () {
      stagedUpdate = stagedUpdate || [];
      pushItemsAtTheTop(stagedUpdate);
      stagedUpdate = [];
    };

    /**
     * Post a new item.
     *
     * @param {promise}                A $q promise that resolves to the full
     *                                 item when the item has been created.
     */
    service.postItem = function(item) {
      latestId++;
      var createdItem = makeStreamItem(latestId);
      createdItem.streamItemTypeSlug = 'post';
      createdItem.owner = _.clone(user.data);
      createdItem.viewer.isOwnedByViewer = true;
      createdItem.dateTimeCreated = new Date().toISOString();
      createdItem.streamItemDisplay = {
        template: '{user.firstName} says: {text}',
        values: {
          user: _.clone(user.data),
          text: item.text
        }
      };
      createdItem.likeCount = 0;
      service.items.unshift(createdItem);
      return util.q.makeResolvedPromise(createdItem);
    };

    /**
     * Deletes a post.
     */
    service.deletePost = function (item) {
      var foundIdx = _.indexOf(service.items, item);
      var deferred = $q.defer();

      if (!user.isAuthenticated) {
        deferred.reject(new Error('Not authenticated.'));
      } else if (user.data.userId !== item.owner.userId) {
        deferred.reject(new Error('No allowed.'));
      } else {
        if (foundIdx >= 0) {
          service.items.splice(foundIdx, 1);
        }
        deferred.resolve();
      }
      return deferred.promise;
    };

    return service;
  }
]);