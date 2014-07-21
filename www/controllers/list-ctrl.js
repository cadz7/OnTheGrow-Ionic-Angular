angular.module('OnTheGrow.controllers')
// ----------------------------------------
// Controller for the browse view
// ----------------------------------------
.controller('ListCtrl', ['$scope', '$stateParams', 'PostsServices', '$ionicModal', '$state', '$ionicLoading', function($scope, $stateParams, PostsServices, $ionicModal, $state, $ionicLoading) {
  console.log($stateParams.listId);
  $scope.goToMap = function () {
    $state.go('app.mapView');
  }

  $scope.posts = PostsServices.getPosts();
  for(var object in $scope.posts)
  {
    if($scope.posts[object].id == $stateParams.listId)
    {
      $scope.list = $scope.posts[object];
    }
  }
  console.log($scope.list); 
  // Edit modal
  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  // Delete an item
  $scope.delete = function(index) {
    $scope.list.items.splice(index, 1);
  };
  // Edit an item
  $scope.edit = function(item) {
    $scope.editItem = item;
    $scope.modal.show();
  };
  // Done
  $scope.done = function(item) {
    item.done = true;
  };
  // save
  $scope.save = function() {
    $scope.editItem = null;
    $scope.modal.hide();
  };
  $scope.apply = function() {
    var url = "https://www.sandbox.paypal.com/cgi-bin/webscr?business=tamerlan4572-facilitator@gmail.com&cmd=_xclick&currency_code=USD&amount=20&item_name=Fruits";
    var ref = window.open(url, '_blank', 'location=no');
  };
  console.log("mapCtrl is run");
  $scope.init = function initialize() {
    console.log("init is run");
    var mapOptions = {
      center: new google.maps.LatLng($scope.list.lat,$scope.list.lng),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);
    $scope.map = map;

     var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));

      var types = document.getElementById('type-selector');
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

      


    // If the place has a geometry, then present it on a map.
 


  };


        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
          e.preventDefault();
          return false;
        });

        $scope.map = map;

      google.maps.event.addDomListener(window, 'load', $scope.init);

      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }


        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      $scope.addMarker = function () {
        if(!$scope.map) {
          return;
        }
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng($scope.list.lat,$scope.list.lng),
            map: $scope.map,
            title: 'Hello World!'
        });

      }
      $scope.init();
      $scope.addMarker();
      $scope.centerOnMe();

      //make the marker work
}])