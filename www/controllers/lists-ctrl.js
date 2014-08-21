angular.module('OnTheGrow.controllers')
// ----------------------------------------
// Lists Page controller
// ----------------------------------------
.controller('ListsCtrl', ['$scope', 'listsService', '$state', 'PostsServices', '$ionicLoading', 'server', '$q', '$log', '$ionicModal',
 function($scope, listsService, $state, PostsServices, $ionicLoading, server, $q, $log, $ionicModal) {
  /* ================= Fetching lists from Express server  =================*/

  listsService.fetchProduceList()
    .then(function(produceList) {
      $log.log('produceList returned in lists controller')
      $log.log(produceList)
      $scope.produceList = produceList
    })
    .then(null, $log.error);

  /* =================OLD FIREBASE CODE =================*/
  $scope.lists = listsService.get();
  // New List
  $scope.newList = {
    items: []
  };
  // New item for list
  $scope.newItem = {};
  // Add an item to the new list
  // Save new list
  $scope.posts = PostsServices.getPosts();
  var count = 0;
  for(var obj in $scope.posts)
  {
    count++;
  }
  $scope.save = function() {
    $scope.newList.items.push({
      title: $scope.newList.title,
      desc: $scope.newItem.description,
      pay: JSON.stringify($scope.newItem.pay),
      address: $scope.newItem.address,
      done: "false",
      id: JSON.stringify(count),
      lat: "0",
      lng: "0",
      name: $scope.newItem.name,
      phone: $scope.newItem.phone,
      email: $scope.newItem.email,
      quantity: $scope.newItem.quantity
    });
    console.log('these are items:');
    console.log($scope.newList.items[0]);
    PostsServices.addressToXY($scope.newList.items[0].address,function(data) {
      console.log(data);
      $scope.newList.items[0].lat = JSON.stringify(data.results[0].geometry.location.lat);
      $scope.newList.items[0].lng = JSON.stringify(data.results[0].geometry.location.lng);
      console.log(angular.toJson($scope.newList.items[0]));
      PostsServices.addPost($scope.newList.title,angular.fromJson(angular.toJson($scope.newList.items[0])));
    });
    $state.go('app.listings');
  };
  
  console.log($scope.posts);
  $scope.init = function() {
    var mapOptions = {
      center: new google.maps.LatLng(43.07493,-89.381388),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"),
        mapOptions);

    // Stop the side bar from dragging when mousedown/tapdown on the map
    google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
      e.preventDefault();
      return false;
    });

    $scope.map = map;
  };

  $scope.centerOnMe = function() {
    if(!$scope.map) {
      console.log("nothing");
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });
  };
  $scope.addMarkers = function () {
    for(var obj in $scope.posts){
      console.log($scope.map);
      var marker = new google.maps.Marker({
          position: new google.maps.LatLng($scope.posts[obj].lat,$scope.posts[obj].lng),
          map: $scope.map,
          title: $scope.posts[obj].title
      });
      var infowindow = new google.maps.InfoWindow({
        content:  "<p id='" + $scope.posts[obj].id + "' ng-click='statechange(" + $scope.posts[obj].id + ")'>click Here@@</p>"
      });
        console.log('title is:' + $scope.posts[obj].title);      
      infowindow.open($scope.map,marker);
    }
  };
  $scope.statechange = function (id) {
    $state.go('app.list', { listId: id });
  }

  $scope.openFilter = function() {
    $scope.createFilterModal.show();
  }

  $ionicModal.fromTemplateUrl('templates/filter-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.createFilterModal = modal;
  });

  $scope.closeFilter = function() {
      $scope.createFilterModal.hide();    
  };

 // $scope.init();
 // $scope.addMarkers();
 // $scope.centerOnMe();



}])