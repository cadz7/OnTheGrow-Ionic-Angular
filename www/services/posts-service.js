angular.module('OnTheGrow.services')
.factory('PostsServices', ['$firebase', '$http', '$ionicPopup', '$state', 'server', '$ionicPopup', '$log', '$rootScope',
 function($firebase, $http, $ionicPopup, $state, server, $ionicPopup, $log, $rootScope) {
/* ======= Posting new list to server========*/
    var posts = [];
    return {
      postToServer: function(data) {
        data.userName = $rootScope.currentUser;
        return server.save(data)
        .$promise
        .then(function(){
            var alertPopup = $ionicPopup.alert({
              title: 'Thank you for posting!',
              template: 'Now you can see the list of all foods!'
            });
            alertPopup.then(function(res) {
              console.log('user submitted a new listing');
            });
        })
        .then(null, $log.error);
      },

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
      /*
        Logs in the user and creates a user field in firebase with user.id
        TODO: We have to invoke inAppBrowser before auth.login to implement facebook/twitter login.
       */
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