angular.module('sproutApp.services.modal-generator', []).factory('modalGenerator', ['$rootScope', 'util', function($rootScope, util) {
  var childCache = {},
      defaultOpts = {
        template: '',
        focusFirstInput: false,
        scope: null,
        animation: 'slide-in-up'
      };

  return {
    createChildModal: function(identifier, opts) {
      var opts = _.extend(defaultOpts, opts);
      
      if (!opts.scope) {
        opts.scope = $rootScope.$new();
      }

      if (!(identifier in childCache)) {
        return $ionicModal.fromTemplateUrl(template, opts);
      }
      else return util.q.makeResolvedPromise(childCache[identifier]);
    }
  }
}])