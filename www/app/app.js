'use strict';

angular.module('sproutApp.controllers', [
  'sproutApp.user',
  'sproutApp.data.stream-items',
  'sproutApp.template',
  'sproutApp.data.activities'
]);
angular.module('sproutApp.services', ['sproutApp.data.leaderboards']);
angular.module('sproutApp.directives', [
  'sproutApp.config',
  'sproutApp.template',
  'sproutApp.data.stream-items',
  'sproutApp.data.activities'
]);
angular.module('sproutApp.filters', []);

angular.module('sproutApp', [
  'ionic',
  'sproutApp.config',
  'sproutApp.controllers',
  'sproutApp.controllers.main',
  'sproutApp.services',
  'sproutApp.directives',
  'sproutApp.filters',
  'sproutApp.data.stream-items',
  'sproutApp.network-information'
])
.run(['$ionicPlatform', 'user', '$log', 'networkInformation', 'streamItems',
  function($ionicPlatform, user, $log, networkInformation, streamItems) {
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

      // Auto-login the user
      user.login('arthur')
        .then(null, $log.error);

      // Run auto-update on stream items.
      streamItems.turnOnAutoUpdate(5000); // Every 5 seconds.
    });
  }
])
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
;

angular.module('sproutApp.config', [])
.constant('STREAM_CONSTANTS', {
  initialCommentCountShown: 2,
  initialPostCharCount: 70
})
.constant('API_CONSTANTS', {
  streamitemTypeId: 9,
  activityLogEndpoint: '/activity_log',
  activityCategoryEndpoint: '/activity_categories'
});
