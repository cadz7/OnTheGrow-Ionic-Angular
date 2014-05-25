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
        template: '<div class="buttons"><button class="button button-clear icon ion-navicon" data-ng-click="toggleLeftMenu()"></button></div>',
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
          scope.avatarUrl = user.data.avatarUrl;
          scope.fullName = [user.data.firstName, ' ', user.data.lastName].join('');

          scope.locationFormatted = [user.data.department, ' - ', user.data.location].join('');
          
          // Careful opening the fridge!
          // TODO: replace this with correct implementation once API is determined using the timePeriod service.
          scope.points = user.data.points[0];
          scope.pointsLabel = 'this month'; // TODO: user.data.points[0].timePeriodId;
        }
      };
    }
  ]
);