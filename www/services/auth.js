angular.module('MyApp')
  .factory('Auth', ['$http', '$location', '$rootScope', '$cookieStore', '$alert', '$ionicPopup'
    function($http, $location, $rootScope, $cookieStore, $alert, $ionicPopup) {
      $rootScope.currentUser = $cookieStore.get('user');
      $cookieStore.remove('user');

      return {
        login: function(user) {
          return $http.post('/api/login', user)
            .success(function(data) {
              $rootScope.currentUser = data;
              $location.path('/');

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
              console.log(status);
              console.log(data);
            });
        },
        signup: function(user) {
          return $http.post('/api/signup', user)
            .success(function() {
              $location.path('/login');

              var alertPopup = $ionicPopup.alert({
                 title: 'You just signed in!',
                 template: 'Thank you for signing in!'
               });
               alertPopup.then(function(res) {
                 console.log('User signed in');
               });
            })
            .error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log(status);
              console.log(data);
            });
        },
        logout: function() {
          return $http.get('/api/logout').success(function() {
            $rootScope.currentUser = null;
            $cookieStore.remove('user');
              var alertPopup = $ionicPopup.alert({
                 title: 'You just signed in!',
                 template: 'Thank you for signing in!'
               });
               alertPopup.then(function(res) {
                 console.log('User signed in');
               });
          });
        }
      };
}]);