angular.module('OnTheGrow.services')
.factory("PostsServices", ["$firebase","$http", function($firebase,$http) {
    var ref = new Firebase("https://glowing-fire-1039.firebaseio.com/");
    var posts = [];
    ref.on("value", function(snapshot) {
      posts = snapshot.val();
      console.log(posts);
    });
    return {
      getPosts: function() {
        return posts;
      },
      addPost: function(title, post) {
        ref.child(title).set(post);
      },
      addressToXY: function(address,callback) {
        $http({method: 'GET', url: 'http://maps.google.com/maps/api/geocode/json?address='+
        address+'&sensor=false'}).
        success(callback);
      },
      getLocation: function () {
        var onSuccess = function(position) {
          alert('Latitude: '          + position.coords.latitude          + '\n' +
                'Longitude: '         + position.coords.longitude         + '\n' +
                'Altitude: '          + position.coords.altitude          + '\n' +
                'Accuracy: '          + position.coords.accuracy          + '\n' +
                'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                'Heading: '           + position.coords.heading           + '\n' +
                'Speed: '             + position.coords.speed             + '\n' +
                'Timestamp: '         + position.timestamp                + '\n');
          $scope.position = position;
          };

          // onError Callback receives a PositionError object
          //
          function onError(error) {
              alert('code: '    + error.code    + '\n' +
                    'message: ' + error.message + '\n');
          }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
      }
    };
  }]);