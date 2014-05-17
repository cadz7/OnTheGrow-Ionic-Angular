'use strict';

angular.module('sproutApp.controllers', []);
angular.module('sproutApp.services', []);
angular.module('sproutApp.directives', []);

angular.module('sproutApp', [
  'ionic',
  'ui.bootstrap',
  'sproutApp.controllers', 
  'sproutApp.services',
  'sproutApp.directives',
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
      templateUrl: 'app/main/signin.html',
      controller: 'SignInCtrl'
    })
    // base abstract state for the tabbed view
    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: 'app/main/main.html'
    })
    .state('main.leaderboards', {
      url: '/leaderboards',
      views: {
        'tab-leaderboards': {
          templateUrl: 'app/leaderboards/leaderboards.html',
          controller: 'LeaderboardsCtrl'
        }
      }
    })
    .state('main.stream', {
      url: '/stream',
      views: {
        'tab-stream': {
          templateUrl: 'app/stream/stream.html',
          controller: 'StreamCtrl'
        }
      }
    })
    .state('main.metrics', {
      url: '/metrics',
      views: {
        'tab-metrics': {
          templateUrl: 'app/metrics/metrics.html',
          controller: 'MetricsCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/main/stream');

})
.constant('STREAM_CONSTANTS', {
  initialCommentCountShown: 2,
  initialPostCharCount: 70
})
.constant('API_CONSTANTS', {
  streamitemTypeId: 9
});