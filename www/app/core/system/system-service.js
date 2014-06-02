angular.module('sproutApp.system', [])
  .factory('system', ['$log',
    function ($log) {
      'use strict';
      var service = {};


      service.initialize = function(){
        service.platform = ionic.Platform.platform();
        service.isIOS = ionic.Platform.isAndroid();
        service.isAndroid = ionic.Platform.isAndroid();
        $log.debug('system has been initialized.')
      };


      return service;
    }
  ]);