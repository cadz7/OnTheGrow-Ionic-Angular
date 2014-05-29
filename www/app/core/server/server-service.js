/* global angular, window */

angular.module('sproutApp.server', [
  'sproutApp.util',
  'sproutApp.config',
  'sproutApp.network-information'
])

// Abstracts interaction with the sprout API server. This service does not do
// any caching - that should be taken care of at the higher level. It does,
// however, check connection status before making calls. It also reports
// connection status to the higher level services.

.factory('server', ['util', '$log','$http','$q','API_URL', 'networkInformation',
  function(util, $log, $http,$q,API_URL, networkInformation) {
    var service = {};
    var options = { headers : {} };//{headers:[{'Authorization':'sprout-token b82da8af04ee46ebbe72557b98dca8d44f391c1f'}]}; //shared options for all http req

    service.isReachable = true;

    var user = {
      userId: 42,
      firstName: 'Arthur',
      lastName: 'Dent',
      avatarUrl: 'img/user/arthur.png',
      department: 'Accounting',
      location: 'Toronto',
      points: [
        {
          timePeriodId: 2,
          score: 1500
        }
      ],
      token: 'e9c77174292c076359b069aef68468d1463845cf',
      expirationDateTime: '2014-07-14T15:22:11Z'
    };

    //common handler for successful calls to the server. resolves the promise with the response.data if successfull HTTP code, 
    //otherwise it rejectes the promise
    function responseHandler(result,promise){
      switch(result.status){
        case 401:
          options.headers['Authorization'] = null;
          break;
        case 404 :
          service.isReachable = false;
          break;
        default:
          service.isReachable = true;
          break;
      }
      if(result.status >= 200 && result.status <= 299)
        promise.resolve(result.data);
      else
        promise.reject(result.data);
    };

    //handler if http fails
    function errorHandler (error, promise){
      service.isReachable = false;
      promise.reject(error.data ? error.data : error);
    };

    networkInformation.onOnline(function() {
      service.isReachable = true;
    });

    networkInformation.onOffline(function() {
      service.isReachable = false;
    });

    //log the user into the system and return the auth token
    service.login = function(username, password, rememberMe) {
      var deferred = $q.defer();
      $http.post(API_URL+'auth/login',{username:username,password:password,rememberMe:rememberMe})
      .then(function(result){        
        options.headers['Authorization'] = 'sprout-token ' +result.data.token;        
        responseHandler(result,deferred);       
      },function(error){
        errorHandler(error,deferred);
      });
      
      return deferred.promise;      
    }

    //logs the user out of the API and clears the client's auth token
    service.logout = function(){
      var deferred = $q.defer();
      $http.post(API_URL+'auth/logout')
      .then(function(result){        
        options.headers['Authorization'] = null;
        responseHandler(result,deferred);       
      },function(error){
        errorHandler(error,deferred);
      });
      
      return deferred.promise;       
    }

    //preform a HTTP GET
    service.get = function(url, params) {
      if (!service.isReachable) {
        return util.q.makeRejectedPromise('offline');
      }

      var deferred = $q.defer();
      var config = options;      
      config.url = API_URL + url;
      config.params = params;
      config.method = 'GET';
      
      $http(config)
      .then(function(result){
        responseHandler(result,deferred);               
      },function(error){
        errorHandler(error,deferred);        
      });
       
      return deferred.promise;      
    };

    //preform a HTTP POST
    service.post = function(url,data) {
      if (!service.isReachable) {
        return util.q.makeRejectedPromise('offline');
      }
     
      var deferred = $q.defer();      
      $http.post(API_URL + url,data, options)
      .then(function(result){
        responseHandler(result,deferred);               
      },function(error){
        errorHandler(error,deferred);        
      });
      
      return deferred.promise;            
    };    

    service.put = function(url,data) {
      if (!service.isReachable) {
        return util.q.makeRejectedPromise('offline');
      }

      var deferred = $q.defer();
      
      $http.put(API_URL + url,data, options)
      .then(function(result){
        responseHandler(result,deferred);               
      },function(error){
        errorHandler(error,deferred);        
      });

      return deferred.promise;           
    };

    service.delete = function(url) {
      if (!service.isReachable) {
        return util.q.makeRejectedPromise('offline');
      }
      var deferred = $q.defer();
      
      $http.delete(API_URL + url,options)
      .then(function(result){
        responseHandler(result,deferred);               
      },function(error){
        errorHandler(error,deferred);        
      });

      return deferred.promise;            
    };

    return service;
  }
]);
