angular.module('OnTheGrow.controllers', [])
// ----------------------------------------
// Controller for the browse view
// ----------------------------------------
.controller('ListsCtrl', function($scope, listsService, $state, PostsServices, $ionicLoading) {
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


 // $scope.init();
 // $scope.addMarkers();
 // $scope.centerOnMe();



})

.controller('PayCtrl', function($scope, $state) {
  $scope.apply = function() {
    //$state.go('app.lists');
    var url = "https://www.sandbox.paypal.com/cgi-bin/webscr?business=tamerlan4572-facilitator@gmail.com&cmd=_xclick&currency_code=USD&amount=20&item_name=Fruits";
    var ref = window.open(url, '_blank', 'location=no');
  };
})

.controller('ListingsCtrl', function($scope, $state, PostsServices) {
  $scope.posts = PostsServices.getPosts();
  console.log($scope.posts);
  for(var object in $scope.posts)
  {
    console.log($scope.posts[object]);
  }
})

.controller('LandingCtrl', function($scope, $state, PostsServices) {
  $scope.applyjob = function() {
    $state.go('app.lists');
  };
  $scope.givejob = function() {
    $state.go('app.listings');
  };
  PostsServices.getPosts();
})
// ----------------------------------------
// Controller for the list view
// ----------------------------------------
.controller('ListCtrl', function($scope, $stateParams, PostsServices, $ionicModal, $state, $ionicLoading) {
  console.log($stateParams.listId);

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
})
// ----------------------------------------
// Menu Controller
// ----------------------------------------
.controller('MenuCtrl', function($scope, listsService) {
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
});
