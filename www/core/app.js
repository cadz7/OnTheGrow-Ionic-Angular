'use strict';

angular.module('sproutApp.controllers', []);
angular.module('sproutApp.services', []);

angular.module('sproutApp', [
  'ionic', 
  'sproutApp.controllers', 
  'sproutApp.services'
])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    // sign in view
    .state('signin', {
      url: '/signin',
      templateUrl: 'main/signin.html',
      controller: 'SignInCtrl'
    })
    // base abstract state for the tabbed view
    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: 'main/main.html'
    })
    .state('main.leaderboards', {
      url: '/leaderboards',
      views: {
        'tab-leaderboards': {
          templateUrl: 'leaderboards/leaderboards.html',
          controller: 'LeaderboardsCtrl'
        }
      }
    })
    .state('main.stream', {
      url: '/stream',
      views: {
        'tab-stream': {
          templateUrl: 'stream/stream.html',
          controller: 'StreamCtrl'
        }
      }
    })
    .state('main.metrics', {
      url: '/metrics',
      views: {
        'tab-metrics': {
          templateUrl: 'metrics/metrics.html',
          controller: 'MetricsCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/main/stream');

});