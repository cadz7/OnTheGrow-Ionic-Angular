/**
 * Created by justin on 2014-05-23.
 */

function hasStreamItemsLocally(params) {
  // this makes the assumption that the minimum id is the oldest, and that we always
  // have every id that comes after it.
  var filterId = params.filterId || 'all';
  if (!streamItemsBinnedByFilter[filterId]) {
    streamItemsBinnedByFilter[filterId] = cache.get('filter'+filterId) || [];
  }

  var localItems = streamItemsBinnedByFilter[filterId];

  if (params.idLessThan) {
    var oldestRequestedItem = _.find(localItems,{id:params.idLessThan - params.maxCount});
    return !!oldestRequestedItem;
  }

  return false;
}