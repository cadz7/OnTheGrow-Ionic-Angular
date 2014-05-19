'use strict';

angular.module('sproutApp.services')
  .factory('headerRemote', ['$log', '$ionicActionSheet', 'user', '$state',
    function($log, $ionicActionSheet, user, $state) {

      var service = {};
      $log.debug(user.isAuthenticated);

      service.showAccountOptions = function() {
        $ionicActionSheet.show({
          titleText: 'Account Management',
          buttons: [
             { text: user.isAuthenticated ? 'Sign out' : 'Sign in' }
          ],
          /*destructiveText: 'Logout',
          destructiveButtonClicked: function() {
            // $scope.AuthSvc.logout();
            // log user out
            return true;
          },*/
          cancelText: 'Back',
          cancel: function() {
            return true;
          },
          buttonClicked: function(index) {
            $log.debug('actionIndex=', index);
            switch (index) {
              case 0:
                if (user.isAuthenticated) {
                  user.logout();
                }
                else {
                  $state.transitionTo('signin');
                }
                break;
              default:
                break;
            }
            return true;
          }
        });
      };

      return service;
    }
  ]);