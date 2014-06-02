angular.module('sproutApp.location-generator-service', [

])

  .factory('locationGenerator', ['$log', 'system',
    function ($log, system) {
      var service = {};

      var iOSBaseUrl = 'maps:q=';
      var genericBaseUrl = 'http://maps.google.com/?q=';

      service.getLocationUrl = function (location) {
        var locationEncoded = encodeURIComponent(location);
        var res = '';
        if (system.platform === 'ios'){
          res += iOSBaseUrl + locationEncoded;
        } else {
          res += genericBaseUrl + locationEncoded;
        }
        return res;
      };

      return service;
    }
  ]);