angular.module('OnTheGrow.services')

/* Auth Service from tracker */

  .factory('Auth', ['$http', '$location', '$rootScope', '$ionicPopup', '$window',
    function($http, $location, $rootScope, $ionicPopup, $window) {
      $rootScope.currentUser = $window.localStorage['user'];
      $window.localStorage['user'] = '';

      return {
        login: function(user) {
          return $http.post('/api/login', user)
            .success(function(data) {
              $rootScope.currentUser = user.email;
              $location.path('/app/landing');

              var alertPopup = $ionicPopup.alert({
                 title: 'You just logged in!',
                 template: 'Thank you for logging in!'
               });
               alertPopup.then(function(res) {
                 console.log('User logged in');
               });
            })
            .error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
        },
        signup: function(user) {
          console.log(user);
          return $http.post('/api/signup', user)
            .success(function() {
              $rootScope.currentUser = user.email;
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
          return $http.get('/api/logout').success(function() {
            $rootScope.currentUser = null;
            delete $window.localStorage['user'];
              var alertPopup = $ionicPopup.alert({
                 title: 'You just logged out',
                 template: 'Thank you for using OnTheGrow!'
               });
               alertPopup.then(function(res) {
                 console.log('User Logged out');
               });
          });
        }
      };
}]);