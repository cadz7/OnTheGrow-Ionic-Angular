/**
 * Created by justin on 2014-05-23.
 */
angular.module('sproutApp.data.stream-items-cache', [
  'sproutApp.util',
  'sproutApp.cache'
])

.factory('streamItemsCache', ['cache', '$log', function(cache, $log) {
  var streamItemsBinnedByFilter = {};

  var service = {
    initialize: function() {
      streamItemsBinnedByFilter = {};
      var filters = cache.get('filters');
      if (filters) {
        filters.forEach(function(filter) {
          streamItemsBinnedByFilter[filter] = cache.get('filter'+filter);
          var fifteenDaysAgo = addDays(new Date(), -15);

          streamItemsBinnedByFilter[filter] = _.filter(streamItemsBinnedByFilter[filter], function(streamItem) {
            // if the stream item is newer than 15 days, allow it to pass through the filter.
            return new Date(streamItem.dateTimeCreated) > fifteenDaysAgo;
          });

          cache.set('filter'+filter, streamItemsBinnedByFilter[filter]);
        });
      }
    },
    clear: function() {
      var filters = cache.get('filters');
      if (filters) {
        filters.forEach(function(filter) {
          cache.delete('filter'+filter);
        });
      }
      cache.delete('filters');
    },
    /**
     * updates the stream item cache for a given filter.
     *
     * @param {int} filterId
     * @param {int} startId            The startId or null if newest.
     * @param  {array} items           The list of items retrieved from the server.
     * @return none
     */
    update: function(filterId, items, startId) {
      // As per requirements, we don't need to support deleting posts
      if(!streamItemsBinnedByFilter[filterId] || !streamItemsBinnedByFilter[filterId].length) {
        streamItemsBinnedByFilter[filterId] = [];
        cache.push('filters', filterId);
      }
      var newestId, oldestId;  // newest/oldest in the context of this update
      if (startId) {
        oldestId = startId;
      } else {
        // because no "endId" is passed in we just have to use the oldest id in the list.
        // So we cannot delete anything older than this "oldestId"
        oldestId = _.min(items, 'streamItemId').streamItemId;
      }

      newestId = _.max(items, 'streamItemId').streamItemId;

      // remove the entire range newest to oldest from the current streamItems
      // this will ensure that any stream items that may have been deleted on the server
      // will not hang around
      streamItemsBinnedByFilter[filterId] = _.filter(streamItemsBinnedByFilter[filterId], function(item) {
        return !(item.streamItemId >= oldestId && item.streamItemId <= newestId);
      });

      streamItemsBinnedByFilter[filterId] = streamItemsBinnedByFilter[filterId].concat(items);
      streamItemsBinnedByFilter[filterId] = _.sortBy(streamItemsBinnedByFilter[filterId], function(streamItem) {
        return -streamItem.streamItemId; // reverse
      });


      cache.set('filter'+filterId, streamItemsBinnedByFilter[filterId]);
    },
    getItems: function(filterId, olderThanId, max) {
      var bin = streamItemsBinnedByFilter[filterId];
      if (!bin) {
        streamItemsBinnedByFilter[filterId] = [];
        return null;
      }

      var returnCount = 0;
      var items = _.filter(bin, function(item) {
        if (returnCount >= max) return false;
        if (item.streamItemId < olderThanId || !olderThanId) {
          returnCount++;
          return true;
        }
      });
      return items;
    }
  };

  function addDays(date, days) {
    return new Date (
        date.getFullYear(),
        date.getMonth(),
        (date.getDate()+days)
    );
  }

  service.initialize();

  return service;
}])

;

//function hasStreamItemsLocally(params) {
//  // this makes the assumption that the minimum id is the oldest, and that we always
//  // have every id that comes after it.
//  var filterId = params.filterId || 'all';
//  if (!streamItemsBinnedByFilter[filterId]) {
//    streamItemsBinnedByFilter[filterId] = cache.get('filter'+filterId) || [];
//  }
//
//  var localItems = streamItemsBinnedByFilter[filterId];
//
//  if (params.idLessThan) {
//    var oldestRequestedItem = _.find(localItems,{id:params.idLessThan - params.maxCount});
//    return !!oldestRequestedItem;
//  }
//
//  return false;
//}