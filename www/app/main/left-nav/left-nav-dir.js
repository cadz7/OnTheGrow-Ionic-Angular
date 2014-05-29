'use strict';

angular.module('sproutApp.main.left-nav', [
  'sproutApp.user',
])
.directive(
  'leftNavToggleBtn',
  [
    '$ionicSideMenuDelegate',
    function($ionicSideMenuDelegate) {
      return {
        restrict: 'E',
        template: '<div class="buttons"><button class="button button-clear icon sprout-icon-menu" data-ng-click="toggleLeftMenu()"></button></div>',
        replace: true,
        link: function(scope, elem, attrs) {
          scope.toggleLeftMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
          };
        }
      };
    }
  ]
).directive(
  'userProfileSummary',
  [
    'user',
    function(user) {
      return {
        restrict: 'E',
        templateUrl: 'app/main/left-nav/user-profile-summary.tpl.html',
        link: function(scope, elem, attrs) {
          user.whenAuthenticated().then(function(){
            scope.avatarUrl = user.data.avatarUrl;
            scope.fullName = [user.data.firstName, ' ', user.data.lastName].join('');
            scope.locationFormatted = [user.data.department, ' - ', user.data.location].join('');
            
            // Careful opening the fridge!
            // TODO: replace this with correct implementation once API is determined using the timePeriod service.
            scope.points = user.data.points[0];
          });
          scope.pointsLabel = 'this month'; // TODO: user.data.points[0].timePeriodId;
        }
      };
    }
  ]
).directive(
  'leftNavMenu',
  [
    'user', '$state', '$ionicActionSheet',
    function(user, $state, $ionicActionSheet) {
      return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
          scope.logout = function() {
            $ionicActionSheet.show({
              buttons: [
                { text: 'Logout' }
              ],
              titleText: 'Logging out will lose any unsaved changes. Continue?',
              cancelText: 'Cancel',
              buttonClicked: function(index) {
                if (index === 0) {
                  // Log them out
                  user.logout().then(
                    function() {
                     // $state.transitionTo('signin');
                      //$ionicActionSheet.hide();
                    },
                    function(err) {
                      // redirect anyway
                      $log.error("unable to log out",err);
                      $state.transitionTo('signin');
                    }
                  );
                }
                return true;
              }
            });
          }
        }
      };
    }
  ]
);