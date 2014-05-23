'use strict';

angular.module('sproutApp')
.directive(
  'leftNavToggleBtn',
  [
    '$ionicSideMenuDelegate',
    function($ionicSideMenuDelegate) {
      return {
        restrict: 'E',
        template: '<div class="buttons"><button class="button button-clear icon ion-navicon-round" data-ng-click="toggleLeftMenu()"></button></div>',
        replace: true,
        link: function(scope, elem, attrs) {
          scope.toggleLeftMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
          };
        }
      };
    }
  ]
);