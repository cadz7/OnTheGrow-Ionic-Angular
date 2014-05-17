angular.module('sproutApp.services')
  .factory('stream', ['$http', '$rootScope', function($http, $rootScope) {

    var service = { items : [] };

    service.loadData = function() {
      return $http.get('http://sproutmobile2.herokuapp.com/v1/streamitems')
        .success(function(data) {
          console.log('Loaded some stream data');
          Array.prototype.push.apply(service.items, data);
          // If using ion-infinite-scroll broadcast completion event
          $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    return service;

  }]);
