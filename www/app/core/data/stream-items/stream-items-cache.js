/**
 * Created by justin on 2014-05-23.
 */
angular.module('sproutApp.data.stream-items-cache', [
  'sproutApp.util',
  'sproutApp.cache'
])

.factory('streamItemsCache', ['cache', '$log', 'APP_CONFIG', '$timeout', '$q', function(cache, $log, APP_CONFIG, $timeout, $q) {
  var streamItemsBinnedByFilter = {};

  function trimBinToQuota(filter, filterIdx) {
    var deferred = $q.defer();
      $timeout(function() {
        $log.debug('Calculating quota... filterIdx, filter-reducer, maxStreamItems', filterIdx, (filterIdx * APP_CONFIG.streamCache.lessFrequentlyAccessedFilterQuotaReducer), APP_CONFIG.streamCache.maxStreamItems);
        var maxQuotaForFilter = APP_CONFIG.streamCache.maxStreamItems - (filterIdx * APP_CONFIG.streamCache.lessFrequentlyAccessedFilterQuotaReducer);
        if (maxQuotaForFilter <= 0) {
          maxQuotaForFilter = APP_CONFIG.streamCache.minStreamItems;
        }
        if (streamItemsBinnedByFilter[filter].length > APP_CONFIG.streamCache.maxStreamItems) {
          $log.debug('Detected a bin that exceeds its quota: ', maxQuotaForFilter, filter, streamItemsBinnedByFilter[filter].length);
          var amountToRemove = streamItemsBinnedByFilter[filter].length - maxQuotaForFilter + APP_CONFIG.streamCache.quotaBufferSize;
          streamItemsBinnedByFilter[filter].splice(0, amountToRemove);
          $log.debug('Removing ', amountToRemove, ' stream items from bin: ', filter);
          $log.debug('After quota resize: ', streamItemsBinnedByFilter[filter]);
          cache.set('filter' + filter, streamItemsBinnedByFilter[filter]);
        }
        deferred.resolve();
      });
    return deferred.promise;
  }

  function ensureStreamItemBinsDontExceedQuota() {
    var deferreds = [];
    // schedule any bins that might have exceeded capacity to be trimmed down to quota.

    var filters = cache.get('filters');
    if (filters) {
      filters.forEach(function(filter, filterIdx) {
        deferreds.push(trimBinToQuota(filter, filterIdx));
      });
    };
    return $q.all(deferreds);
  }

  var service = {
    initialize: function() {
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
      var waitUntilAllBinsHaveBeenTrimmedToMeetSizeQuotas = ensureStreamItemBinsDontExceedQuota();

      var deferred = $q.defer();
      // update cache asynchronously because this update might be called on stream items
      // that are waiting to be rendered.
      $timeout(function() {
        try {
          // As per requirements, we don't need to support deleting posts
          if(!streamItemsBinnedByFilter[filterId] || !streamItemsBinnedByFilter[filterId].length) {
            streamItemsBinnedByFilter[filterId] = [];
            $log.debug('Adding Filter: ', filterId);
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

          deferred.resolve(streamItemsBinnedByFilter[filterId]);
        } catch (err) {
          deferred.reject(err);
        }
      });

      // the update() promise won't resolve until all of the bins have been trimmed to meet their size quotas
      // and the current filter bin that is being updated is complete.
      return $q.all([deferred.promise, waitUntilAllBinsHaveBeenTrimmedToMeetSizeQuotas]);
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