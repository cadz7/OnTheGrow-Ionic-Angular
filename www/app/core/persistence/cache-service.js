/**
 * Created by justin on 2014-05-20.
 */

angular.module('sproutApp.cache',
    ['sproutApp.localStorage']
)

.factory('cache', ['$log', 'localStorage', function($log, localStorage) {
  return {
    get: function(key) {
      var val = localStorage.getItem(key);
      if (!val) return null;

      if (_.contains(val, '[') || _.contains(val, '{'))
        return JSON.parse(val);
      else
        return val;
    },
    set: function(key, val) {
      if (angular.isArray(val) || angular.isObject(val)) {
        val = JSON.stringify(val);
      }
      localStorage.setItem(key, val);
    },
    push: function(key, val) {
      var stored = this.get(key);
      if (!stored) {
        $log.warn('cache: $localStorage does not contain: ', key, ' adding it.');
        this.set(key, [val]);
      } else {
        if (stored.push) {
          stored.push(val);
          this.set(key, stored);
        } else {
          throw 'cache: cannot call push on a non-array type.';
        }
      }
    }
  };
}])
;


