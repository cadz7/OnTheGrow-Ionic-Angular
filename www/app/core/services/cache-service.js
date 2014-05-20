/**
 * Created by justin on 2014-05-20.
 */

angular.module('sproutApp.services.cache', [])

.factory('cache', ['$log', '$localStorage', function($log, $localStorage) {
  return {
    get: function(key) {
      $localStorage.getItem(key);
    },
    set: function(key, val) {
      $localStorage.setItem(key, val);
    }
  };
}])
.value('$localStorage', window.localStorage)
;


