'use strict';

angular.module('OnTheGrow.controllers', [])
// ----------------------------------------
// Controller for the browse view
// ----------------------------------------
.controller('LandingCtrl', ['$scope', '$state', 'PostsServices', function ($scope, $state, PostsServices) {
  $scope.applyjob = function() {
    $state.go('app.lists');
  };
  $scope.givejob = function() {
    $state.go('app.listings');
  };
  PostsServices.getPosts();
}])