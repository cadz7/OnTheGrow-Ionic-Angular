angular.module('sproutApp.data.membership', [
  'sproutApp.user',
  'sproutApp.util'
])

  .factory('membership', ['$log','$q', 'user', 'util',
    function ($log, $q, user, util) {
      var service = {};

      function logAction(type, id, groupId){
        $log.debug('joining ' + type + ' #' + id + ' with group #' + groupId);
      }

      service.joinChallenge = function(id, groupId){
        logAction('challenge', id, groupId);
        if (id > 1){
          return util.q.makeResolvedPromise('success');
        } else {
          return util.q.makeRejectedPromise('error');
        }
      };


      service.joinEvent = function(id, groupId){
        logAction('event', id, groupId);
        if (id > 1){
          return util.q.makeResolvedPromise('success');
        } else {
          return util.q.makeRejectedPromise('error');
        }
      };

      service.joinGroup = function(id, groupId){
        logAction('group', id, groupId);
        if (id > 1){
          return util.q.makeResolvedPromise('success');
        } else {
          return util.q.makeRejectedPromise('error');
        }
      };

      return service;
    }
  ]);