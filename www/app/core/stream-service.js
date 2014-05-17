angular.module('sproutApp.services')
  .factory('stream', ['$http', '$rootScope', '$q', '$timeout', function($http, $rootScope, $q, $timeout) {

    var service = { items : [] };

    service.loadData = function() {
      return $http.get('http://sproutmobile2.herokuapp.com/v1/streamitems?maxPageSize=10')
        .success(function(data) {
          console.log('Loaded some stream data');
          Array.prototype.push.apply(service.items, data);
          // If using ion-infinite-scroll broadcast completion event
          $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    service.deletePost = function(item) {
      var foundIdx = _.indexOf(service.items, item),
          deferred = $q.defer();

      $timeout(function() {
        if (foundIdx) {
          service.items.splice(foundIdx,1);
          _.each(cbs, function(cb) {
            cb();
          });
        }

        deferred.resolve("deleted");
      },100);

      return deferred.promise;
    }

    return service;

  }]);
