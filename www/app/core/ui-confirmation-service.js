'use strict';

angular.module('sproutApp.services.ui-confirmation', [])
  .factory('uiConfirmation', ['$log', '$ionicActionSheet', '$q',
    function($log, $ionicActionSheet, $q) {
      var defaults = {
        titleText: '',
        buttons: [],
        cancelText: 'Back'
      };

      return {
        prompt: function(opts) {
          var deferred = $q.defer();
          
          _.defaults(opts, defaults);
          
          if ('destructiveText' in opts && !opts.destructiveButtonClicked) {
            opts.destructiveButtonClicked = function() {
              deferred.resolve({
                type: 'DESTRUCTIVE'
              });
              return true;
            };
          }

          opts.cancel = function() {
            deferred.resolve({
              type: 'CANCELLED'
            });
            return true;
          };

          opts.buttonClicked = function(index) {
            deferred.resolve({
              type: 'BUTTON',
              index: index
            });
            return true;
          };

          $ionicActionSheet.show(opts);

          return deferred.promise;
        }
      };
    }
  ]);