'use strict';

angular.module('OnTheGrow.controllers')
// ----------------------------------------
// Controller for the Login view
// ----------------------------------------
.controller('LoginCtrl', ['$scope', 'Auth', function($scope, Auth) {
    $scope.login = function(user) {
      Auth.login({
        email: user.email,
        password: user.password
      });
    };
}])