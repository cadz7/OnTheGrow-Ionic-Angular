/**
 * Created by justin on 2014-05-20.
 */

angular.module('sproutApp.server-post-queue',
    ['sproutApp.cache', 'sproutApp.config']
)

.factory('server-post-queue', ['server', 'cache', 'APP_CONFIG', function(server, cache, APP_CONFIG) {
  var syncQ = cache.get('server_post_queue');
  if (!syncQ) {
    syncQ = [];
  }

  // every time the app connected event fires this service will attempt to send whatever is in the queue.
  server.onConnection(executeQueue);

  // INTERFACE:
  return {
    // This is it, the only method you need to call is queue.
    // queue(endpointPath, arguments)
    queue: queue
  };


  // If the POST succeeds, then remove from queue, else keep in queue until it does succeed.
  function executeQueue() {
    var i = 0, initialQLength = syncQ.length;

    while (initialQLength && i < initialQLength) {
      var request = syncQ.shift();
      // if we have already tried to do this request too many times

      server.post(request.endpoint, request.args).then(
        function(obj) {
          // NOTE: this is a hidden feature that you can call a callback once the sync complets successfully.
          if (request.success) {
            request.success(obj);
          }
        },
        function error(response) {
          if (response !== 'offline') {
            request.attemptCount++;
          } else {
            // swallow the error and do nothing.  It stays in the queue.
          }

          if (request.attemptCount >= APP_CONFIG.poisonMsgThreshold) {
            // don't put it back in the queue because it is poison.
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
    syncQ.push({endpoint: endpoint, args: args, attemptCount: 0, success: successCallback});
    cache.set('server_post_queue', syncQ);
  }
}])
;