angular.module('OnTheGrow.controllers')
// ----------------------------------------
// Controller for the Signup view
// ----------------------------------------
.controller('NewListCtrl', ['$scope', '$state', '$ionicLoading', 'PostsServices', '$cordovaCamera', '$log',
 function($scope, $state, $ionicLoading, PostsServices, $cordovaCamera, $log) {
 	$scope.uploadedImage = [];
 	$scope.count = 0;
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
    	newItem.uploadedImages = $scope.uploadedImage;
    	$log.log(newItem.uploadedImages)
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

    $scope.takePicture = function() {
    	if ( $scope.count < 3)
    	{
	    	 var options = { 
		        quality : 75, 
		        destinationType : Camera.DestinationType.DATA_URL, 
		        sourceType : Camera.PictureSourceType.PHOTOLIBRARY, 
		        allowEdit : true,
		        encodingType: Camera.EncodingType.JPEG,
		        targetWidth: 100,
		        targetHeight: 100,
		        popoverOptions: CameraPopoverOptions,
		        saveToPhotoAlbum: false
		    };

	    	$cordovaCamera.getPicture(options)
	    	.then(function(imageData) {
	    		$scope.count++;
	     		$scope.uploadedImage[$scope.count] = "data:image/jpeg;base64," + imageData;
		    }, function(err) {
		    	$log.error;
		    });
		}
		else {
			$ionicLoading.show({
				duration: 1500,
				template: 'Limit exceeded'
			});
		}
    }

}])