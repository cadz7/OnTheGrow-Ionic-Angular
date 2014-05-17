'use strict';

angular.module('sproutApp.services')
  .factory('headerRemote', ['$log', '$ionicActionSheet',
    function($log, $ionicActionSheet) {

      var service = {};

      service.showAccountOptions = function() {
        $ionicActionSheet.show({
          titleText: 'Account Management',
          //            buttons: [
          //                { text: 'Change Password' },
          //                { text: 'Track an Activity' }
          //            ],
          destructiveText: 'Logout',
          destructiveButtonClicked: function() {
            // $scope.AuthSvc.logout();
            // log user out
            return true;
          },
          cancelText: 'Back',
          cancel: function() {
            return true;
          },
          buttonClicked: function(index) {
            $log.debug('actionIndex=', index);
            return true;
          }
        });
      };

      return service;
    }
  ]);