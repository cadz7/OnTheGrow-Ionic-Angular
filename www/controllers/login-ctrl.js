'use strict';

angular.module('OnTheGrow.controllers')
// ----------------------------------------
// Controller for the browse view
// ----------------------------------------
.controller('LoginCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.apply = function() {
    //$state.go('app.lists');
    var url = "https://www.sandbox.paypal.com/cgi-bin/webscr?business=tamerlan4572-facilitator@gmail.com&cmd=_xclick&currency_code=USD&amount=20&item_name=Fruits";
    var ref = window.open(url, '_blank', 'location=no');
  };
}])