angular.module('OnTheGrow.controllers')
// ----------------------------------------
// Menu Controller
// ----------------------------------------
.controller('MenuCtrl', ['$scope', 'PostsServices', 'Auth', function($scope, PostsServices, Auth) {
  // Search to do lists
  $scope.search = function() {
    if ($scope.query)
      $scope.results = $scope.lists.find($scope.query);
    else
      $scope.clear();
  };
  // clear search
  $scope.clear = function() {
    $scope.query = null;
    $scope.results = null;
  };
   $scope.logout = function() {
      Auth.logout();
    };
}]);