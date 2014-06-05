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
        $log.debug('Calculating quota for: filterIdx, filter-reducer, maxStreamItems', filterIdx, (filterIdx * APP_CONFIG.streamCache.lessFrequentlyAccessedFilterQuotaReducer), APP_CONFIG.streamCache.maxStreamItems);
        var maxQuotaForFilter = APP_CONFIG.streamCache.maxStreamItems - (filterIdx * APP_CONFIG.streamCache.lessFrequentlyAccessedFilterQuotaReducer);
        if (maxQuotaForFilter <= 0) {
          maxQuotaForFilter = APP_CONFIG.streamCache.minStreamItems;
        }
        if (streamItemsBinnedByFilter[filter].length > APP_CONFIG.streamCache.maxStreamItems) {
          $log.debug('Detected a bin that exceeds its quota: ', maxQuotaForFilter, streamItemsBinnedByFilter[filter].length);
          var amountToRemove = streamItemsBinnedByFilter[filter].length - maxQuotaForFilter + APP_CONFIG.streamCache.quotaBufferSize;
          streamItemsBinnedByFilter[filter].splice(0, amountToRemove);
          $log.debug('Removing ', amountToRemove, ' stream items from bin: ', filter);
          $log.debug('Bin size after resize: ', streamItemsBinnedByFilter[filter].length);
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
      $log.debug('Initializing stream cache...');
      var totalCachedStreamItems = 0;
      var filters = cache.get('filters');
      if (filters) {
        filters.forEach(function(filter) {
          streamItemsBinnedByFilter[filter] = cache.get('filter'+filter);
          var fifteenDaysAgo = addDays(new Date(), -15);
          var streamItemCountBeforeFilteringByAge = streamItemsBinnedByFilter[filter].length;
          streamItemsBinnedByFilter[filter] = _.filter(streamItemsBinnedByFilter[filter], function(streamItem) {
            // if the stream item is newer than 15 days, allow it to pass through the filter.
            return new Date(streamItem.dateTimeCreated) > fifteenDaysAgo;
          });
          if (streamItemCountBeforeFilteringByAge != streamItemsBinnedByFilter[filter].length) {
            $log.debug('Removed', streamItemCountBeforeFilteringByAge-streamItemsBinnedByFilter[filter].length, 'items of', streamItemCountBeforeFilteringByAge, 'because they were older than 15 days.');
          }
          totalCachedStreamItems += streamItemsBinnedByFilter[filter].length;
          cache.set('filter'+filter, streamItemsBinnedByFilter[filter]);
        });
        $log.debug('Initialization complete.  Number of bins loaded:', filters.length, 'total cached stream items:', totalCachedStreamItems);
      } else {
        $log.debug('Initialization complete.  Number of bins loaded:', 0, 'total cached stream items:', 0);
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
      filterId = filterId.toString();

      var deferred = $q.defer();
      // update cache asynchronously because this update might be called on stream items
      // that are waiting to be rendered.
      $timeout(function() {
        try {
          $log.debug('updating stream item cache.');
          if(!streamItemsBinnedByFilter[filterId] || !streamItemsBinnedByFilter[filterId].length) {
            streamItemsBinnedByFilter[filterId] = [];
            $log.debug('Adding new bin for filter: ', filterId);
            var filters = cache.get('filters');
            if (!_.contains(filters, filterId))
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
          $log.debug('updating stream item cache completed successfully.');
        } catch (err) {
          deferred.reject(err);
        }
      });

      var waitUntilAllBinsHaveBeenTrimmedToMeetSizeQuotas = ensureStreamItemBinsDontExceedQuota();
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