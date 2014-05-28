angular.module('sproutApp.data.event', [
  'sproutApp.user',
  'sproutApp.util'
])

  .factory('event', ['$log', '$q', 'user', 'util',
    function ($log, $q, user, util) {
      var service = {};

      var mockEventDetailData = {
        eventName: 'someEventName',
        eventDescription: 'someEventDescription'

      };

      service.getEventDetails = function (eventId) {
        if (eventId > 1) {
          return util.q.makeResolvedPromise(mockEventDetailData);
        } else {
          return util.q.makeRejectedPromise('error');
        }
      };

      return service;
    }
  ]);