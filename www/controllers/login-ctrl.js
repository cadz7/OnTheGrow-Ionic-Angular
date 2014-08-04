'use strict';

angular.module('OnTheGrow.controllers')
// ----------------------------------------
// Controller for the Login view
// ----------------------------------------
.controller('LoginCtrl', ['$scope', 'Auth', function($scope, Auth) {
    $scope.login = function() {
      Auth.login({
        email: $scope.email,
        password: $scope.password
      });
    };
}])