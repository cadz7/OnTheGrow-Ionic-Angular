angular.module('sproutApp.data.sharing-service', [
  'sproutApp.util'
])

  .factory('sharingService', ['$log', '$q', 'util', 'filters',
    function ($log, $q, util, filters) {
      // TODO: eventually use the code block below or appropriate API endpoint
      
      var service = {data : {}},
          cachedData;

      /*cachedData = [
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
      ];*/

      filters.whenReady()
      .then(function () {
        service.sharingTargets = cachedData = _.reduce(
          filters.streamItemFilters,
          function(memo, item) {
            memo.push({
              displayName: item.displayName,
              filterId: item.filterId
            });

            return memo;
          },
          []
        );

      });

      service.fetchSharingTargets = function() {
        // TODO: Actually fetch from API
        return util.q.makeResolvedPromise(cachedData);
      };


      return service;
    }
  ]);