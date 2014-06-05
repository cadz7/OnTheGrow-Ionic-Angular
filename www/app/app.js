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
  'sproutApp.data.activities',
  'sproutApp.system',
  'sproutApp.location-generator-service',
  'sproutApp.data.sharing-service',
  'sproutApp.services.ui-confirmation'
]);
angular.module('sproutApp.directives', [
  'sproutApp.main.left-nav',
  'sproutApp.stream-directive'
]);
angular.module('sproutApp.filters', [
  'sproutApp.comment.trimToLatest'
]);

angular.module('sproutApp.ionic.extend', [
  'sproutApp.ionic.extend.ion-action-sheet-from-top'
]);

angular.module('sproutApp', [
  'ionic',
  'sproutApp.ionic.extend',
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
.run(['$ionicPlatform', 'user', '$log', 'networkInformation', 'streamItems','$state','$rootScope', 'system', 'Notify',
  function($ionicPlatform, user, $log, networkInformation, streamItems,$state,$rootScope, system, Notify) {

    window.onerror = function(error) {
      $log.error(error);
    };

    function logDeviceDetails() {
      var buildInfo = {
        IonicVersion: ionic.version
      };

      var deviceDetails = {
        Platform: ionic.Platform.platform(),
        Version: ionic.Platform.version(),
        Grade: ionic.Platform.grade
      };

      $log.info('====== BUILD INFO =======\r\n', buildInfo);
      $log.info('====== DEVICE INFO ====== \r\n', deviceDetails);
      $log.info('Welcome to Sprout App!');
      system.initialize();
    }

    function verifyRequiredPluginsAreInstalled() {
      if (!window.cordova) {
        $log.error('cordova namespace missing.');
      } else if (!window.cordova.plugins) {
        $log.error('cordova plugins namespace missing');
      } else {
        if (!window.plugins.calendar) {
          $log.error('MISSING PLUGIN: calendar');
        }
        if (!window.cordova.plugins.Keyboard) {
          $log.error('MISSING PLUGIN: ionic-keyboard');
        }
        if (!window.SoftKeyboard) {
          $log.error('MISSING PLUGIN: SoftKeyboard');
        }
        if (!window.navigator || !window.navigator.connection) {
          $log.error('MISSING PLUGIN: network-information');
        }
      }
    }

    $ionicPlatform.ready(function() {
      logDeviceDetails();
      networkInformation.initialize();
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

      // according to docs, if you set preference Fullscreen="true" in confix.xml you must
      // set ionic.PlatformisFullScreen = true; manually for android.
      ionic.Platform.isFullScreen = true;

      //if the user has been logged out after they logined, take them back to the login
      $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
          if (!user.isAuthenticated && toState.name !== SIGNIN_STATE) {
            event.preventDefault();
            $state.transitionTo(SIGNIN_STATE);
          }          
        });

      verifyRequiredPluginsAreInstalled();

      // Run auto-update on stream items.
      user.whenAuthenticated().then(function(){
        //streamItems.turnOnAutoUpdate(5000); // Every 5 seconds.
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

.config([ "$provide", 'APP_CONFIG', function( $provide, APP_CONFIG ) {
  $provide.decorator( '$log', [ "$delegate", function( $delegate ) {
    var $log = $delegate;

    Date.prototype.format = function(format) {
      var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
      };

      if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
          (this.getFullYear()+"").substr(4 - RegExp.$1.length));
      for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
                RegExp.$1.length==1 ? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
      return format;
    }

    var prepareLogFn = function(logFn) {
      var enhancedLogFn = function () {
        var args = Array.prototype.slice.call(arguments),
            now  = new Date().format('hh:mm:ss:S');

        // prepends timestamp to the message
        args.unshift(now + ' -');
        var msg = '';
        args.forEach(function(arg) {
          if (angular.isString(arg)) {
            msg += " " + arg;
          } else {
            try {
              msg += ": "+JSON.stringify(arg);
            } catch (ex) {
              // intentionally swallow...
              // TODO: figure out how to handle cyclic graphs.
              msg += 'Could not serialize data structure because it contains references to itself.';
            }
          }
        });

        if ($log.messages[0] !== msg) {
          $log.messages.unshift(msg);
        }
        if ($log.messages.count > APP_CONFIG.maxLogSize + 50) {
          $log.messages = $log.messages.slice(0, APP_CONFIG.maxLogSize-50);
        }

        logFn.apply(null, args);
      };

      // needed to support angular-mocks expectations
      enhancedLogFn.logs = [ ];

      return enhancedLogFn;
    };

    $log.log   = prepareLogFn( $log.log );
    $log.info  = prepareLogFn( $log.info );
    $log.warn  = prepareLogFn( $log.warn );
    $log.debug = prepareLogFn( $log.debug );
    $log.error = prepareLogFn( $log.error );
    $log.messages = [];

    return $log;
  }]);
}]);
;


