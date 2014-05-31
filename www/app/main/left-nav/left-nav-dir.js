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
    'user','scores','filters','$log',
    function(user, scores, filters,$log) {
      return {
        restrict: 'E',
        templateUrl: 'app/main/left-nav/user-profile-summary.tpl.html',
        link: function(scope, elem, attrs) {
          
          filters.whenReady()   //filters are loaded after user is auth'd       
          .then(function(){
            return scores.getScoresForUser(filters.defaultTimePeriod.filterId);
          })
          .then(function(scores){
            scope.avatarURL = user.data.avatarURL;
            scope.fullName = [user.data.firstNameDisplay, ' ', user.data.lastNameDisplay].join('');
            scope.locationFormatted = [user.data.department, ' - ', user.data.location].join('');
            scope.score = scores[0].score;
            scope.pointsLabel = filters.defaultTimePeriod.displayName;
          })
          .then(null,$log.error);
        }
      };
    }
  ]
).directive(
  'leftNavMenu',
  [
    'user', '$state', '$ionicActionSheet','$log',
    function(user, $state, $ionicActionSheet, $log) {
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
                  user.logout();
                    
                 
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