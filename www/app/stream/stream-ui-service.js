/**
 * The join service handles calls to the memberbership service
 * from some stream-item/post.
 */
angular.module('sproutApp.services')
  .factory('streamUIService', ['$log', '$ionicActionSheetFromTop', 'filters', '$q',
    function ($log, $ionicActionSheetFromTop, filters, $q) {
      'use strict';

      var service = {};

      var _streamFilterButtons = null;

      function _loadStreamFilterButtons() {
        if (!_streamFilterButtons) {
          _streamFilterButtons = [];
          _.forEach(filters.streamItemFilters, function (streamItemFilter) {
            _streamFilterButtons.push(
              {
                text: streamItemFilter.displayName,
                streamItemFilter: streamItemFilter
              });
          });

        }
        return _streamFilterButtons;
      }

      service.pickFilter = function () {
        var deferred = $q.defer();

        filters.whenReady()
          .then(function () {
            $ionicActionSheetFromTop.show({
              titleText: 'Filter By Type:',
              buttons: _loadStreamFilterButtons(),
              cancelText: 'Back',
              cancel: function () {
                deferred.reject('user clicked cancel');
                return false;
              },
              buttonClicked: function (index) {
                deferred.resolve(this.buttons[index].streamItemFilter);
                return true;
              }
            })
          }, $log.error);

        return deferred.promise;
      };


      return service;
    }
  ]);