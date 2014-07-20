angular.module('OnTheGrow.controllers')
// ----------------------------------------
// Controller for the browse view
// ----------------------------------------
.controller('ListingsCtrl', ['$scope', '$state', 'PostsServices', function($scope, $state, PostsServices) {
  $scope.posts = PostsServices.getPosts();
  console.log($scope.posts);
  for(var object in $scope.posts)
  {
    console.log($scope.posts[object]);
  }
}])