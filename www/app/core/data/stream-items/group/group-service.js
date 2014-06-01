angular.module('sproutApp.data.group', [
  'sproutApp.user',
  'sproutApp.util'
])

  .factory('group', ['$log', '$q', 'user', 'util', 'API_CONSTANTS', 'mockGroupServer',
    function ($log, $q, user, util, API_CONSTANTS, server) {
      var service = {};


      service.getGroupDetails = function (groupId) {
        return server.get(API_CONSTANTS.groupsEndpoint + '/' + groupId);
      };

      return service;
    }
  ])
  .factory('mockGroupServer', ['$q', 'util', 'API_CONSTANTS', '$log',
    function ($q, utils, API_CONSTANTS, $log) {
      'use strict';

      var mockGroupDetailData = {
        groupId: 242,
        groupName: 'IT Group',
        groupImageURL: 'img/group/group-default.png',
        numGroupMembers: '20',
        groupMembers: {}
      };


      return {
        get: function (url, query) {
          $log.debug('called mock group service ' + url, query)
          var deferred = $q.defer();
          deferred.resolve(mockGroupDetailData);
          return deferred.promise;
        },

        getMockData: function(){
          return mockGroupDetailData;
        }
      };
    }
  ])
;