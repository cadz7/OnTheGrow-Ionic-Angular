/**
 * Created by justin on 2014-05-20.
 */

angular.module('sproutApp.services.sync', [])

.factory('sync', ['server', function(server) {
  // If the POST succeeds, then remove from queue, else keep in queue until it does succeed.
  server.onConnection(executeQueue);

  function executeQueue() {
    
  }

  return {};
}])
;