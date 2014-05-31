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
     * @param  {String} email       User name.
     * @param  {String} password       Password.
     * @param  {bool} rememberMe       put the user in local storage?
     * @return {promise}               A $q promise that resolves when the user
     *                                 is logged in or is rejected when the
     *                                 login fails.
     */
    user.login = function (email, password, rememberMe) {
      var deferred = $q.defer();
      
      if(APP_CONFIG.useMockData){
        if(email!== 'arthur' && !(email==='simon@rangle.io'&&password==='testtest')){
          deferred.reject({errorCode:'hallow'});
          return deferred.promise;
        }

        var newUser = {
          userId: 42,
          email : 'simon@rangle.io',
          firstNameDisplay: 'Arthur',
          lastNameDisplay: 'Dent',
          avatarURL: 'img/user/arthur.png',
          department: 'Accounting',
          location: 'Toronto'          
        };

        user.data = newUser;
        
        if(rememberMe){
          userStorage.set(newUser);
        }else{
          userStorage.removeUser();          
        }

        user.isAuthenticated = true;
       return userSettings.fetchSettings()
        .then(function(){
          return userSettings.saveSetting('rememberMe',rememberMe);
        })
        .then(function() {
          authenticatedDeferred.resolve();
        });
        
      }else{
        return server.login(email, password,rememberMe)
        .then(function(){
          return server.get(API_CONSTANTS.currentUserEndpoint);
        })
        .then(function(newUser) {
          user.data = newUser;
          
          if(rememberMe){
            userStorage.set(newUser);
          }else{
            userStorage.removeUser();
          }

          return  userSettings.fetchSettings();
        })
        .then(function(){
          return userSettings.saveSetting('rememberMe',rememberMe);
        })
        .then(function(){        
          user.isAuthenticated = true;
          authenticatedDeferred.resolve();
          deferred.resolve();
        })
        .then(null,function(error){
          $log.error(error)
          user.data = null;
          userStorage.removeUser();
          user.isAuthenticated = false;         
          deferred.reject(error);
        });
      }
    };

    /**
     * Attemps to log out the user. Will reload the page if successful
     *
     * @return {promise}               A $q promise that is rejected if the
     *                                 logout fails. (We don't return anything
     *                                 in case of success since the app is
     *                                 reloaded at this point.)
     */
    user.logout = function () {
      if(APP_CONFIG.useMockData){
        user.isAuthenticated = false;
        userStorage.removeUser();
        //Note: the complexity of this is derived from cordova's hosting the app as just opening a local file in the browser (ie. file://.....)      
        $window.location.replace($window.location.toString().split('#')[0]);      
        return util.q.makeResolvedPromise();
      }else{
        user.isAuthenticated = false;
        userStorage.removeUser();
        //Note: the complexity of this is derived from cordova's hosting the app as just opening a local file in the browser (ie. file://.....)      
        return server.logout()
                     .then(null,$log.error)
                    .finally(function(result){$window.location.replace($window.location.toString().split('#')[0]);})      
      }
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