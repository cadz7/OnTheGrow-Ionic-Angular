angular.module('OnTheGrow.controllers')
// ----------------------------------------
// Controller for the browse view
// ----------------------------------------
.controller('ListingsCtrl', ['$scope', '$state', 'PostsServices', 'listsService', '$log',
 function($scope, $state, PostsServices, listsService, $log) {
  listsService.fetchPersonalList()
    .then(function(personalList) {
      $log.log('produceList returned in lists controller')
      $log.log(personalList);
      $scope.personalList = personalList.data;
    })
    .then(null, $log.error);

    $scope.takePicture = function() {
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

    	$cordovaCamera.getPicture(options).then(function(imageData) {
     		$scope.uploadedImage = "data:image/jpeg;base64," + imageData;
	    }, function(err) {
	    	$log.error;
	    });
    }

}])