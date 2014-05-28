angular.module('sproutApp.data.group', [
  'sproutApp.user',
  'sproutApp.util'
])

  .factory('group', ['$log', '$q', 'user', 'util',
    function ($log, $q, user, util) {
      var service = {};

      var mockGroupDetailData = {
        groupName: 'someGroupName',
        groupDescription: 'someGroupDescription'

      };

      service.getGroupDetails = function (groupId) {
        if (groupId > 1) {
          return util.q.makeResolvedPromise(mockGroupDetailData);
        } else {
          return util.q.makeRejectedPromise('error');
        }
      };

      return service;
    }
  ]);