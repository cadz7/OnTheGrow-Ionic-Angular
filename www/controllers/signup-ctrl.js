angular.module('OnTheGrow.controllers')
// ----------------------------------------
// Controller for the Signup view
// ----------------------------------------
.controller('SignupCtrl', ['$scope', 'Auth', function($scope, Auth) {
    $scope.signup = function(user) {
    console.log(user);
      Auth.signup({
        email: user.email,
        password: user.password,
	    title: user.title,
	    produceName: user.produceName,
	    quantity: user.quantity,
	    price: user.price,
	    desc: user.desc,
	    date: user.date
      });
    };
}])