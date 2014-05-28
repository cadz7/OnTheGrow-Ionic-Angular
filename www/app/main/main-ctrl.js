angular.module('sproutApp.controllers.main', [
  'sproutApp.network-information'
])

.controller('MainCtrl', ['$scope', 'networkInformation','user','$state', '$ionicModal', 'APP_CONFIG'
  function ($scope, networkInformation,user,$state, $ionicModal, APP_CONFIG) {
    'use strict';
    var developerMenu;

    $scope.user = user;
    $scope.APP_CONFIG = APP_CONFIG;

    $ionicModal.fromTemplateUrl('app/main/developer-menu/developer-menu.tpl.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true
    }).then(function(modal) {
      developerMenu = modal;
    });

    //logs out user and reloads the page
    $scope.logout = function(){
      user.logout();
    }

    $scope.showDevMenu = function() {
      developerMenu.show();
    };

    $scope.hideDeveloperMenu =function() {
      developerMenu.hide();
    };

    // Clean up modals when scope is destroyed
    $scope.$on('$destroy', function() {
      developerMenu.remove();
    });
  }
]);

