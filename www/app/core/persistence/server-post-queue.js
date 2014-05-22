/**
 * Created by justin on 2014-05-20.
 */

angular.module('sproutApp.server-post-queue',
    ['sproutApp.cache', 'sproutApp.config', 'sproutApp.network-information']
)

.factory('serverPostQueue', ['server', 'cache', 'APP_CONFIG', 'networkInformation', '$log', function(server, cache, APP_CONFIG, networkInformation, $log) {
  var syncQ
      ,qKey = 'server_post_queue';

  syncQ = cache.get(qKey);
  if (!syncQ) {
    syncQ = [];
  }

  // every time the app connected event fires this service will attempt to send whatever is in the queue.
  networkInformation.onOnline(executeQueue);

  // INTERFACE:
  return {
    // This is it, the only method you need to call is queue.
    // queue(endpointPath, arguments)
    queue: queue
  };

  // If the POST succeeds, then remove from queue, else keep in queue until it does succeed.
  function executeQueue() {
    var i = 0, initialQLength = syncQ.length;

    if (initialQLength) {
      $log.log('Attempting to sync activity log with server: ', syncQ);
    }

    while (initialQLength && i < initialQLength) {
      var request = syncQ.shift();
      // if we have already tried to do this request too many times

      server.post(request.endpoint, request.args).then(
        function(obj) {
          // NOTE: this is a hidden feature that you can call a callback once the sync completes successfully.
          if (request.success) {
            request.success(obj);
          }
          // persist that the request has been removed.
          cache.set(qKey, syncQ);
        },
        function error(response) {
          if (response !== 'offline') {
            $log.error('Failed to sync activity: ', request, response);
            request.attemptCount++;
          } else {
            $log.debug('Attempt to sync activity failed due to being offline: ', request);
            // swallow the error and do nothing.  It stays in the queue.
          }

          if (request.attemptCount >= APP_CONFIG.poisonMsgThreshold) {
            $log.error('A poison message was found and is being removed from the serverPostQueue: ', request);
          } else {
            // since we couldn't process it, put it back in the queue.
            syncQ.push(request);
          }
        }
      );

      i++;
    }
  }

  function queue(endpoint, args, successCallback) {
    $log.debug('adding to serverPostQueue (endpoint, args): ', endpoint, args);
    syncQ.push({endpoint: endpoint, args: args, attemptCount: 0, success: successCallback});
    cache.set(qKey, syncQ);
  }
}])
;