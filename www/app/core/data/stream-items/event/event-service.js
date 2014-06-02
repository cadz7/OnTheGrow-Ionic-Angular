angular.module('sproutApp.data.event', [
  'sproutApp.user',
  'sproutApp.util'
])

  .factory('event', ['$log', '$q', 'user', 'util', 'API_CONSTANTS', 'mockEventServer', 'locationGenerator',
    function ($log, $q, user, util, API_CONSTANTS, server, locationGenerator) {
      var service = {};

      service.getEventDetails = function (eventId) {
        return server.get(API_CONSTANTS.eventsEndpoint + '/' + eventId)
          .then(function(eventDetails){
            eventDetails.eventLocationUrl = locationGenerator.getLocationUrl(eventDetails.eventLocation);
            return eventDetails;
          }, $log.error);
      };

      return service;
    }
  ])
  .factory('mockEventServer', ['$q', 'util', 'API_CONSTANTS', '$log',
    function ($q, utils, API_CONSTANTS, $log) {
      'use strict';

      var mockEventDetailData = {
        eventId: 22,
        eventName: '5k Marathon',
        eventDateTime: new Date(),
        eventLocation: '1337 Front St W Toronto, ON ',
        eventImageURL: 'img/group/event-default.png',
        numEventAttendees: 192,
        eventAttendees: {},
        eventDescription: 'The flat and fast features of this event have consistently been the reason for so many ' +
          'people achieving a personal best, qualifying for Boston, having a memorable first marathon or an outstanding' +
          ' race. Power walkers and slower runners also love this course because of its 6 hour time limit. read more »'
      };


      return {
        get: function (url, query) {
          $log.debug('called mock event service ' + url, query)
          var deferred = $q.defer();
          deferred.resolve(mockEventDetailData);
          return deferred.promise;
        },

        getMockData: function(){
          return mockEventDetailData;
        }
      };
    }
  ])
;