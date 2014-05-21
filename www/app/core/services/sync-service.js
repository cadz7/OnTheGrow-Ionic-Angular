/**
 * Created by justin on 2014-05-20.
 */

angular.module('sproutApp.services.sync', [])

.factory('sync', ['server', function(server) {
  var syncQ = [];
  // If the POST succeeds, then remove from queue, else keep in queue until it does succeed.
  server.onConnection(executeQueue);

  function executeQueue() {
    var i = 0, initialQLength = syncQ.length;

    while (initialQLength && i < initialQLength) {
      var request = syncQ.shift();
      server.post(request.endpoint, request.args).then(
        function(obj) {
          // NOTE: this is a hidden feature that you can call a callback once the sync complets successfully.
          if (request.success) {
            request.success(obj);
          }
        },
        function error() {
          request.attemptCount++;
          syncQ.push(request); // add to end of queue
        }
      );

      i++;
    }
  }

  function queue(endpoint, args, successCallback) {
    syncQ.push({endpoint: endpoint, args: args, attemptCount: 0, success: successCallback});
  }

  return {
    queue: queue
  };
}])
;