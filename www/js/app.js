// Ionic SwipeToDo App
angular.module('OnTheGrow', [
  'ionic',
  'OnTheGrow.controllers',
  'OnTheGrow.services',
  'OnTheGrow.directives',
  'firebase',
])
  .run(function($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova)
        $rootScope.map = plugin.google.maps.Map.getMap();
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        // Can change colour of the status bar
        StatusBar.styleDefault();
      }
    });
  })
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html'
      })
      .state('app.signup', {
        url: '/signup',
        views: {
          'menuContent': {
            templateUrl: 'templates/signup.html',
            controller: 'SignupCtrl'
          }
        }
      })
      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
          }
        }
      })
      .state('app.landing', {
        url: '/landing',
        views: {
          'menuContent': {
            templateUrl: 'templates/landing.html',
            controller: 'LandingCtrl'
          }
        }
      })
      .state('app.settings', {
        url: '/settings',
        views: {
          'menuContent': {
            templateUrl: 'templates/settings.html',
          }
        }
      })
      .state('app.lists', {
        url: '/lists',
        views: {
          'menuContent': {
            templateUrl: 'templates/lists.html',
            controller: 'ListsCtrl'
          }
        }
      })
      .state('app.new', {
        url: '/lists/new',
        views: {
          'menuContent': {
            templateUrl: 'templates/new-list.html',
            controller: 'ListsCtrl'
          }
        }
      })
      .state('app.pay', {
        url: '/pay',
        views: {
          'menuContent': {
            templateUrl: 'templates/pay.html',
            controller: 'PayCtrl'
          }
        }
      })
      .state('app.listings', {
        url: '/listings',
        views: {
          'menuContent': {
            templateUrl: 'templates/listings.html',
            controller: 'ListingsCtrl'
          }
        }
      }) 
      .state('app.mapView', {
        url: '/mapView',
        views: {
          'menuContent': {
            templateUrl: 'templates/mapView.html'
          }
        }
      })        
      .state('app.list', {
        url: '/lists/:listId',
        views: {
          'menuContent': {
            templateUrl: 'templates/list.html',
            controller: 'ListCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/landing');
  });
