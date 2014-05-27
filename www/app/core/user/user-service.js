/* global window */
angular.module('sproutApp.user', [
  'sproutApp.user.storage',
  'sproutApp.server',
  'sproutApp.util'
])

.factory('user', ['userStorage', 'userSettings', '$q', '$log', '$window', 'util', 'server','API_CONSTANTS','APP_CONFIG',
  function (userStorage, userSettings, $q, $log, $window, util, server, API_CONSTANTS,APP_CONFIG) {
    'use strict';
    var user = {};
    var authenticatedDeferred = $q.defer();

    user.isAuthenticated = false; // Shows whether the user is authenticated.
    // This does not mean the server thinks we are authenticated, just that
    // the user is logged in as far as the client is concerned. If we are
    // logged but have lost the auth token, we are still "authenticated",
    // our authentication is just on hold. This service does not concern
    // itself with this - that should be handled by the server service.

    // Since the app will need to work in an off-line mode, we'll have to be
    // optimistic about authentication: once we've authenticated the user,
    // we consider them authenticated until we hear otherwise.
    function getUserStatus() {
      user.data = userStorage.get();
      if (_.isObject(user.data) && user.data.userId) {
        console.log('loaded user from cache')
        user.isAuthenticated = true;
        authenticatedDeferred.resolve();
      }else{
        user.isAuthenticated = false;        
      }
      return user.data;
    }

    /**
     * Returns a promise that resolves when the user is authenticated. This is
     * to account for the case where the app starts in a non-authenticated mode
     * and goes into the authenticated mode later.
     *
     * @return {promise}               A $q promise that resolves when the user
     *                                 is authenticated.
     */
    user.whenAuthenticated = function () {
      return authenticatedDeferred.promise;
    };

    /**
     * Tries to logs the user in with the provided user name and password, and stores the user profile + settings if successful
     *
     * @param  {String} username       User name.
     * @param  {String} password       Password.
     * @return {promise}               A $q promise that resolves when the user
     *                                 is logged in or is rejected when the
     *                                 login fails.
     */
    user.login = function (username, password) {
      var deferred = $q.defer();
      
      if(APP_CONFIG.useMockData){
        if(username!== 'arthur' && !(username==='simon@rangle.io'&&password==='testtest')){
          deferred.reject({errorCode:'hallow'});
          return deferred.promise;
        }

        var newUser = {
          userId: 42,
          firstName: 'Arthur',
          lastName: 'Dent',
          avatarUrl: 'img/user/arthur.png',
          department: 'Accounting',
          location: 'Toronto',
          sproutScore: 23142,
          points: [
            {
              timePeriodId: 2,
              score: 1500
            }
          ],
          token: 'e9c77174292c076359b069aef68468d1463845cf',
          expirationDateTime: '2014-07-14T15:22:11Z'
        };

        user.data = newUser;
        userStorage.set(newUser);
        user.isAuthenticated = true;
        userSettings.fetchSettings().then(function() {
          authenticatedDeferred.resolve();
        });
        
        deferred.resolve();
      }else{
       server.login(username, password)
        .then(function(){
          return server.get(API_CONSTANTS.currentUserEndpoint);
        })
        .then(function(newUser) {
          user.data = newUser;
          userStorage.set(newUser);
          return  userSettings.fetchSettings();
        }).then(function(){        
          user.isAuthenticated = true;
          authenticatedDeferred.resolve();
          deferred.resolve();
        })
        .then(null,function(error){
          user.data = null;
          userStorage.removeUser();
          user.isAuthenticated = false;         
          deferred.reject(error);
        });
      }
        return deferred.promise;
    };

    /**
     * Attemps to log out the user.
     *
     * @return {promise}               A $q promise that is rejected if the
     *                                 logout fails. (We don't return anything
     *                                 in case of success since the app is
     *                                 reloaded at this point.)
     */
    user.logout = function () {
      user.isAuthenticated = false;
      userStorage.removeUser();
      $window.location.replace('/');
      return util.q.makeResolvedPromise();
    };

    // Runs initialization.
    function init() {
      getUserStatus();
    }

    // Some functions for testing purposes.
    user.testing = {
      reload: function () {
        init();
      }
    };

    init();

    return user;
  }
]);