angular.module('sproutApp.data.sharing-service', [
  'sproutApp.util'
])

  .factory('sharingService', ['$log', '$q', 'util',
    function ($log, $q, util) {
      var service = {data : {}},
          cachedData = [
            {
              displayName: 'Everyone',
              filterId: 1
            },
            {
              displayName: 'My Department',
              filterId: 2
            },
            {
              displayName: 'My Location',
              filterId: 3
            },
            {
              displayName: 'My Region',
              filterId: 4
            }
          ];


      service.fetchSharingTargets = function() {
        // TODO: Actually fetch from API
        return util.q.makeResolvedPromise(cachedData);
      };

      service.sharingTargets = cachedData;

      return service;
    }
  ]);