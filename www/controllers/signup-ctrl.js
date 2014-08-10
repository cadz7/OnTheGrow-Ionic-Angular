angular.module('OnTheGrow.controllers')
// ----------------------------------------
// Controller for the Signup view
// ----------------------------------------
.controller('SignupCtrl', ['$scope', 'Auth', function($scope, Auth) {
    $scope.signup = function(user) {
    console.log(user);
      Auth.signup({
        email: user.email,
        password: user.password
      });
    };
}])