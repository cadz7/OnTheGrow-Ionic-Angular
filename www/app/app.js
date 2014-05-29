'use strict';

angular.module('sproutApp.controllers', [
  'sproutApp.user',
  'sproutApp.data.stream-items',
  'sproutApp.template',
  'sproutApp.data.activities',
  'sproutApp.data.filters',
  'sproutApp.controllers.user-settings',
  'sproutApp.network-information'
]);
angular.module('sproutApp.services', [
  'sproutApp.user-settings',
  'sproutApp.data.leaderboards',
  'sproutApp.data.joinable-stream-item-service',
  'sproutApp.data.challenge',
  'sproutApp.data.group',
  'sproutApp.data.event',
  'sproutApp.data.membership',
  'sproutApp.data.scores',
  'sproutApp.config',
  'sproutApp.template',
  'sproutApp.data.stream-items',
  'sproutApp.data.activities'
]);
angular.module('sproutApp.directives', [
  'sproutApp.main.left-nav'
]);
angular.module('sproutApp.filters', [
  'sproutApp.comment.trimToLatest'
]);

angular.module('sproutApp', [
  'ionic',
  'sproutApp.config',
  'sproutApp.controllers',
  'sproutApp.controllers.main',
  'sproutApp.services',
  'sproutApp.directives',
  'sproutApp.filters',
  'sproutApp.data.stream-items',
  'sproutApp.network-information',
  'sproutApp.notification'
])
.run(['$ionicPlatform', 'user', '$log', 'networkInformation', 'streamItems','$state','$rootScope',
  function($ionicPlatform, user, $log, networkInformation, streamItems,$state,$rootScope) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      var SIGNIN_STATE = 'signin';
      if(!user.isAuthenticated){
        $state.transitionTo(SIGNIN_STATE);
      }

      //if the user has been logged out after they logined, take them back to the login
      $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
          if (!user.isAuthenticated && toState.name !== SIGNIN_STATE) {
            event.preventDefault();
            $state.transitionTo(SIGNIN_STATE);
          }          
        });

      // Run auto-update on stream items.
      user.whenAuthenticated().then(function(){
        streamItems.turnOnAutoUpdate(5000); // Every 5 seconds.
      });
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
    .state('main.user-settings', {
      url: '/user-settings',
      views: {
        'mainContent': {
          templateUrl: 'app/user-settings/user-settings.html',
          controller: 'UserSettingsCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/signin');
})
;


