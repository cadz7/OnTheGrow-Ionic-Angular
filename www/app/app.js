'use strict';

angular.module('sproutApp.controllers', [
  'sproutApp.user',
  'sproutApp.data.stream-items',
  'sproutApp.template',
  'sproutApp.data.activities',
  'sproutApp.data.filters'
]);
angular.module('sproutApp.services', [
  'sproutApp.data.leaderboards',
  'sproutApp.data.challenge',
  'sproutApp.data.membership',
  'sproutApp.config',
  'sproutApp.template',
  'sproutApp.data.stream-items',
  'sproutApp.data.activities'
]);
angular.module('sproutApp.directives', [
  'sproutApp.main.left-nav'
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
      user.login('simon@rangle.io','testtest',false)
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
        'mainContent': {
          templateUrl: 'app/leaderboards/leaderboards.html',
          controller: 'LeaderboardsCtrl'
        }
      }
    })
    .state('main.stream', {
      url: '/stream',
      views: {
        'mainContent': {
          templateUrl: 'app/stream/stream.html',
          controller: 'StreamCtrl'
        }
      }
    })
    .state('main.metrics', {
      url: '/metrics',
      views: {
        'mainContent': {
          templateUrl: 'app/metrics/metrics.html',
          controller: 'MetricsCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/main/stream');

})

// TODO note: @justin will move this to an appropriate place and fully implement it
.service('toaster', ['$log', function($log) {
  var toaster = { pop: function(type,title,message){console.log("[" + type + "] " + title + ":" + message ); }};
  return toaster;
}])

// TODO note: @justin will move this to an appropriate place and fully implement it
.service('Notify', ['$log', 'toaster', function($log, toaster) {
  $log.debug('Notify() Initialized...');
  return {
    userError: function(msg, title) {
      if (!title) {
        title = 'Error Detected';
      }
      $log.log(title, msg);
      toaster.pop('error', title, msg);
    },
    apiError: function(msg, title) {
      if (!title) {
        title = 'Error';
      }
      $log.error(msg);
      toaster.pop('error', title, msg);
    },
    userSuccess: function(msg, title) {
      if (!title) {
        title = 'Good News';
      }
      $log.debug(title, msg);
      toaster.pop('success', title, msg);
    }
  };
}])
;

angular.module('sproutApp.config', [])
.constant('API_URL','https://platform.dev.sproutatwork.com/v1/')
.constant('STREAM_CONSTANTS', {
  defaultMaxItemCount: 10 , //default number of stream items to get in a single req
  initialCommentCountShown: 2,
  initialPostCharCount: 70
})
.constant('API_CONSTANTS', {
  streamitemTypeId: 9,
  //AUTHENTICATION note: login is preformed by server.login inorder to keep track of the auth token
  logoutEndpoint : 'auth/logout',
  refreshTokenEndpoint : 'auth/refresh_token',
  currentUserEndpoint : 'auth/current_user',

  //ACTIVITIES
  activityLogEndpoint: 'activity_log',
  activityCategoryEndpoint: 'activity_categories',

  //STREAM ITEMS
  streamItemsEndPoint : 'stream_items'

})
.constant('APP_CONFIG', {
  poisonMsgThreshold: 10,
  useMockData :  true//use hard coded mock data or connect to the actual sprout api?
});

