angular.module('OnTheGrow.controllers')
// ----------------------------------------
// Menu Controller
// ----------------------------------------
.controller('MenuCtrl', ['$scope', 'PostsServices', function($scope, PostsServices) {
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
}]);