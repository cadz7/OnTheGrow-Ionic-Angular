angular.module('OnTheGrow.controllers')
// ----------------------------------------
// Controller for the Signup view
// ----------------------------------------
.controller('NewListCtrl', ['$scope', '$state', '$ionicLoading', 'PostsServices', function($scope, $state, $ionicLoading, PostsServices) {

	$scope.showLoading = function(){
	  $ionicLoading.show({
	    template: 'Posting to server...'
	  });
	};

	$scope.hideLoading = function(){
	$ionicLoading.hide();
	};

    $scope.newList = function(newItem) {
	    console.log(newItem);
	    $scope.showLoading();
	    	PostsServices.postToServer(newItem)
	    	.then(function(result) {
	    		$scope.hideLoading();
	    		console.log(result);
	    		$state.go('app.lists');
	    	})
	    	.then(null, function(error){
	    		$scope.hideLoading();
	    	})
    };
}])