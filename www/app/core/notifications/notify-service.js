/**
 * Created by justin on 2014-05-28.
 */

angular.module('sproutApp.notification', ['toaster', 'sproutApp.config'])

.service('Notify', ['$log', 'toaster', 'APP_CONFIG', function($log, toaster, APP_CONFIG) {
  $log.debug('Notify() Initialized...');
  var service = {
    userError: function(msg, title) {
      if (!title) {
        title = 'Error Detected';
      }
      $log.log(title, msg);
      toaster.pop('error', title, msg);
    },
    apiError: function(msg, title) {
      if (!title) {
        title = 'Error';
      }
      $log.error(msg);
      toaster.pop('error', title, msg);
    },
    userSuccess: function(msg, title) {
      if (!title) {
        title = 'Good News';
      }
      $log.debug('Notify: ', title, msg);
      toaster.pop('success', title, msg);
    },
    warn: function(msg, title) {
      if (!title) {
        title = 'Warning!';
      }
      $log.warn('Notify: ', title, msg);
      toaster.pop('warning', title, msg);
    },
    errorMsg: APP_CONFIG.errorMsg,
    notifyTheCommonErrors: function(customHandler) {
      return function(response) {
        if (response === 'offline') {
          service.userError(service.errorMsg.SORRY_BUT_YOU_ARE_OFFLINE);
        } else if (response.status === 403) {
          service.userError(service.errorMsg.UNAUTHORIZED);
          throw response;
        }
        if (customHandler) {
          customHandler(response);
        }
      };
    }
  };

  return service;
}])
;