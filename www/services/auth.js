angular.module('OnTheGrow.services')

/* Auth Service from tracker */

  .factory('Auth', ['$http', '$location', '$rootScope', '$ionicPopup', '$window', '$log', 'SERVER_URL', '$ionicLoading',
    function($http, $location, $rootScope, $ionicPopup, $window, $log, SERVER_URL, $ionicLoading) {
      $rootScope.currentUser = $window.localStorage['user'];
      $window.localStorage['user'] = '';

      return {
        login: function(user) {
            $ionicLoading.show({
              template: 'Attempting login... <br><br> <i class="icon ion-loading-c"></i>'
            });
          return $http.post(SERVER_URL + '/api/login', user)
            .success(function(data) {
              $ionicLoading.hide();
              $log.log(data);
              $rootScope.currentUser = user;
              $location.path('/app/lists');

              $ionicLoading.show({
                  template: '<p class="padding text-center"> Welcome! <br> View listings of local produce <br> or <br> Find them on the map! </p>',
                  delay: 100,
                  duration: 3000
                });
            })
            .error(function(data, status, headers, config) {
                  $ionicLoading.show({
                    template: 'Incorrect username or password!',
                    delay: 1000,
                    duration: 1500
                  });
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
        },
        signup: function(user) {
          console.log(user);
          return $http.post(SERVER_URL + '/api/signup', user)
            .success(function() {
              $rootScope.currentUser = user;
              $window.localStorage['user'] = user.email;
              $location.path('/app/landing');
              var alertPopup = $ionicPopup.alert({
                 title: 'You just signed up!',
                 template: 'Thank you for signing up!'
               });
               alertPopup.then(function(res) {
                 console.log('User signed up');
               });
            })
            .error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log(status);
              console.log(data);
              console.log(headers);
              console.log(config);
            });
        },
        logout: function() {
           $ionicLoading.show({
              template: 'Logging out... <br><br> <i class="icon ion-loading-c"></i>'
            });
          return $http.get(SERVER_URL + '/api/logout').success(function() {
            $ionicLoading.hide();
            $rootScope.currentUser = null;
            delete $window.localStorage['user'];
          })
          .error(function(data, status, headers, config) {
              $ionicLoading.show({
                template: 'Couldn\'t log out due to server issues.',
                duration: 1500
              });
            });
        }
      };
}]);