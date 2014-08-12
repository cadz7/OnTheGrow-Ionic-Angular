angular.module('OnTheGrow.controllers')
// ----------------------------------------
// Controller for the browse view
// ----------------------------------------
.controller('ListingsCtrl', ['$scope', '$state', 'PostsServices', 'listsService', '$log',
 function($scope, $state, PostsServices, listsService, $log) {
  listsService.fetchPersonalList()
    .then(function(personalList) {
      $log.log('produceList returned in lists controller')
      $log.log(personalList)
      $scope.personalList = personalList;
    })
    .then(null, $log.error);


}])